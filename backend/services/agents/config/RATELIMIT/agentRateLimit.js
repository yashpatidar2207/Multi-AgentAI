import redis from "../../../../shared/redis/redis.js";

const WINDOW_SIZE = 60; // 60 seconds

const LIMITS = {
  chat: 5,
  coding: 3,
  pdf: 3,
  ppt: 3,
  image: 3,
  search: 5,
};

/**
 * Sliding Window Counter Rate Limiter
 *
 * Example:
 * limit = 10 requests
 * window = 60 seconds
 *
 * The current window and previous window are
 * weighted to calculate the approximate number
 * of requests in the current rolling window.
 */
export const checkAgentLimit = async (userId, agent) => {
  const max = LIMITS[agent] ?? LIMITS.chat;

  const now = Math.floor(Date.now() / 1000);

  // Current 60-second window
  const currentWindow = Math.floor(now / WINDOW_SIZE);

  // Previous 60-second window
  const previousWindow = currentWindow - 1;

  const currentKey = `rate:${agent}:${userId}:${currentWindow}`;
  const previousKey = `rate:${agent}:${userId}:${previousWindow}`;

  /**
   * How much time has passed inside the current window.
   *
   * Example:
   *
   * Current window:
   * 12:00:00 ───────────────── 12:01:00
   *             ↑
   *           now
   *
   * If 20 seconds have passed:
   *
   * elapsed = 20
   */
  const elapsed = now % WINDOW_SIZE;

  /**
   * Weight of the previous window.
   *
   * At the beginning:
   *
   * elapsed = 0
   * previousWeight = 1
   *
   * At the end:
   *
   * elapsed = 59
   * previousWeight ≈ 0.016
   *
   * So the older requests gradually lose
   * importance as the window moves forward.
   */
  const previousWeight =
    (WINDOW_SIZE - elapsed) / WINDOW_SIZE;

  /**
   * Increment current window counter.
   */
  const currentCount = await redis.incr(currentKey);

  /**
   * Keep the current counter alive slightly longer
   * than the window so that it can still be used
   * as the previous window after rotation.
   */
  if (currentCount === 1) {
    await redis.expire(
      currentKey,
      WINDOW_SIZE * 2
    );
  }

  /**
   * Get previous window count.
   */
  const previousCount =
    Number(await redis.get(previousKey)) || 0;

  /**
   * Sliding Window Counter calculation.
   *
   * Estimated request count =
   *
   * current window count
   * +
   * previous window count × remaining portion
   * of the previous window
   */
  const estimatedCount =
    currentCount +
    previousCount * previousWeight;

  /**
   * Request is not allowed if the weighted
   * request count exceeds the configured limit.
   */
  if (estimatedCount > max) {
    /**
     * Roll back the request that we just counted.
     *
     * Otherwise rejected requests would continue
     * consuming the user's rate-limit quota.
     */
    await redis.decr(currentKey);

    /**
     * Calculate how long until the current
     * window moves into the next bucket.
     */
    const remainingSeconds =
      WINDOW_SIZE - elapsed;

    const minutes =
      Math.floor(remainingSeconds / 60);

    const seconds =
      remainingSeconds % 60;

    const time =
      minutes > 0
        ? `${minutes}m ${seconds}s`
        : `${seconds}s`;

    const error = new Error(
      `Rate limit exceeded for ${agent}.`
    );

    error.status = 429;

    error.data = {
      success: false,
      agent,
      limit: max,
      remainingTime: remainingSeconds,
      retryAfter: time,
      message: `You have reached the ${agent} limit (${max} requests per rolling ${WINDOW_SIZE} seconds). Try again in ${time}.`,
    };

    throw error;
  }

  return {
    remaining: Math.max(
      0,
      Math.floor(max - estimatedCount)
    ),
    limit: max,
  };
};