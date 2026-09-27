import { AnimatePresence, motion } from "framer-motion";
import { X, Crown, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import { createOrder } from "../features/createOrder.js";
import { verifyPayment } from "../features/verifyPayment.js";

function BillingPage({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);

  const credits = userData?.credits || 0;
  const totalCredits = userData?.totalCredits || 0;

  const creditPercentage =
    totalCredits > 0 ? Math.min((credits / totalCredits) * 100, 100) : 0;

  const handleUpgrade = async (plan) => {
    try {
      const data = await createOrder(plan);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: "MultiAI",
        description: `${data?.plan?.name} Plan`,
        order_id: data?.order?.id,

        handler: async (response) => {
          try {
            await verifyPayment(response);
          } catch (error) {
            console.log(error);
          }
        },

        theme: {
          color: "#4F46E5",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* =====================================================
              BACKDROP
              Left side remains visible with blur
          ===================================================== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-40
              bg-black/45
              backdrop-blur-[4px]
            "
          />

          {/* =====================================================
              BILLING DRAWER
              Mobile  : 82vw
              Desktop : 380px
          ===================================================== */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.28,
              ease: "easeOut",
            }}
            className="
              fixed
              right-0
              top-0
              z-50
              flex
              h-[100dvh]
              w-[82vw]
              flex-col
              overflow-hidden
              border-l
              border-white/10
              bg-[#0f1117]
              shadow-2xl

              sm:w-[380px]
            "
          >
            {/* =====================================================
                HEADER
            ===================================================== */}
            <div
              className="
                relative
                flex
                h-[76px]
                shrink-0
                items-center
                justify-center
                border-b
                border-white/10
                px-4

                sm:h-[88px]
                sm:px-5
              "
            >
              {/* CENTERED HEADER CONTENT */}
              <div className="text-center">
                <h2
                  className="
                    text-base
                    font-semibold
                    text-white

                    sm:text-lg
                  "
                >
                  Billing
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-400

                    sm:text-sm
                  "
                >
                  Plans & Credits
                </p>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                aria-label="Close billing"
                className="
                  absolute
                  right-3
                  top-1/2
                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-lg
                  bg-white/5
                  transition
                  hover:bg-white/10
                  active:scale-95

                  sm:right-5
                "
              >
                <X size={18} className="text-slate-300" />
              </button>
            </div>

            {/* =====================================================
                SCROLLABLE BILLING CONTENT
            ===================================================== */}
            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                overscroll-contain
                px-3
                py-4

                sm:px-5
                sm:py-5
              "
            >
              {/* ===================================================
                  CURRENT PLAN
              =================================================== */}
              <div
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  p-4

                  sm:p-4
                "
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >
                  <div className="min-w-0">
                    <p
                      className="
                        text-xs
                        text-slate-400

                        sm:text-sm
                      "
                    >
                      Current Plan
                    </p>

                    <h3
                      className="
                        mt-1
                        truncate
                        text-lg
                        font-bold
                        capitalize
                        text-white

                        sm:text-xl
                      "
                    >
                      {userData?.plan ?? "Free"}
                    </h3>
                  </div>

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-yellow-400/5
                    "
                  >
                    <Crown size={21} className="text-yellow-300" />
                  </div>
                </div>

                {/* CREDITS */}
                <div className="mt-5">
                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                      gap-2
                      text-[11px]
                      text-slate-400

                      sm:text-xs
                    "
                  >
                    <span>Credits</span>

                    <span className="whitespace-nowrap">
                      {credits}/{totalCredits}
                    </span>
                  </div>

                  <div
                    className="
                      h-2
                      w-full
                      overflow-hidden
                      rounded-full
                      bg-white/10
                    "
                  >
                    <div
                      className="
                        h-full
                        rounded-full
                        bg-indigo-200
                        transition-all
                        duration-500
                      "
                      style={{
                        width: `${creditPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ===================================================
                  PLANS
              =================================================== */}
              <div
                className="
                  mt-4
                  space-y-3

                  sm:mt-5
                  sm:space-y-4
                "
              >
                {/* =================================================
                    STARTER PLAN
                ================================================= */}
                <div
                  className="
                    rounded-xl
                    border
                    border-white/10
                    p-4
                    transition
                    hover:border-white/20
                  "
                >
                  <h3
                    className="
                      text-base
                      font-semibold
                      text-white

                      sm:text-lg
                    "
                  >
                    Starter
                  </h3>

                  <p
                    className="
                      mt-1.5
                      text-xl
                      font-bold
                      text-indigo-200

                      sm:text-2xl
                    "
                  >
                    ₹99
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-400

                      sm:text-sm
                    "
                  >
                    1,000 Credits
                  </p>

                  <button
                    className="
                      mt-4
                      flex
                      min-h-[44px]
                      w-full
                      items-center
                      justify-center
                      rounded-lg
                      bg-indigo-200
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-violet-800
                      transition
                      hover:bg-indigo-300
                      active:scale-[0.99]

                      sm:text-base
                    "
                    onClick={() => handleUpgrade("starter")}
                  >
                    Upgrade
                  </button>
                </div>

                {/* =================================================
                    PRO PLAN
                ================================================= */}
                <div
                  className="
                    relative
                    rounded-xl
                    border
                    border-indigo-200
                    p-4
                    transition
                    hover:border-indigo-300
                  "
                >
                  {/* POPULAR BADGE */}
                  <span
                    className="
                      absolute
                      right-3
                      top-3
                      rounded-full
                      bg-indigo-400
                      px-2
                      py-1
                      text-[10px]
                      font-medium
                      text-white

                      sm:text-xs
                    "
                  >
                    Popular
                  </span>

                  <div className="pr-16">
                    <h3
                      className="
                        flex
                        items-center
                        gap-2
                        text-base
                        font-semibold
                        text-white

                        sm:text-lg
                      "
                    >
                      Pro
                      <Zap size={15} className="shrink-0 text-yellow-300" />
                    </h3>

                    <p
                      className="
                        mt-1.5
                        text-xl
                        font-bold
                        text-indigo-200

                        sm:text-2xl
                      "
                    >
                      ₹149
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-400

                        sm:text-sm
                      "
                    >
                      2,000 Credits
                    </p>
                  </div>

                  <button
                    className="
                      mt-4
                      flex
                      min-h-[44px]
                      w-full
                      items-center
                      justify-center
                      rounded-lg
                      bg-indigo-300
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-violet-700
                      transition
                      hover:bg-indigo-400
                      active:scale-[0.99]

                      sm:text-base
                    "
                    onClick={() => handleUpgrade("pro")}
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>

            {/* =====================================================
                FOOTER
            ===================================================== */}
            <div
              className="
                shrink-0
                border-t
                border-white/10
                px-4
                py-3
                pb-[calc(0.75rem+env(safe-area-inset-bottom))]

                sm:px-5
                sm:py-4
              "
            >
              <p
                className="
                  text-[10px]
                  leading-relaxed
                  text-slate-500

                  sm:text-xs
                "
              >
                Credits can be used for Image, PDF, PPT, and Code Generation.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BillingPage;
