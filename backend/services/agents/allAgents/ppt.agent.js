import { checkAgentLimit } from "../config/RATELIMIT/agentRateLimit.js";
import { deductUserCredits } from "../utils/deductUserCredits.js";

export const pptAgent = async () => {
  // check rate limit
  await checkAgentLimit(state.userId, "ppt");
  await deductUserCredits(state.userId, "ppt");
  return {
    ...state,
    aiResponse: error?.data?.message ||  `⏳ PPT Agent will be coming soon 😊.`,
  };
};
