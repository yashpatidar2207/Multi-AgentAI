import React from "react";
import { useSelector } from "react-redux";
import MessageBox from "./MessageBox";

function MessageList({ isGenerating }) {
  const { selectedConversation } = useSelector((state) => state.conversation);

  const { messages } = useSelector((state) => state.message);

  const isEmpty = !selectedConversation || messages.length === 0;

  return (
    <div
      className="
        flex-1
        min-h-0
        min-w-0

        overflow-y-auto

        px-3
        sm:px-4
        md:px-6

        py-4
        md:py-6

        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
      "
    >
      {isEmpty ? (
        <div
          className="
            h-full

            flex
            flex-col
            items-center
            justify-center

            gap-3
            sm:gap-4

            text-center

            px-3
          "
        >
          <div
            className="
              flex
              flex-col
              gap-1
            "
          >
            <h1
              className="
                text-[16px]
                sm:text-[18px]
                md:text-[20px]

                font-semibold

                text-slate-200

                tracking-tight
              "
            >
              MultiAgentAI
            </h1>

            <h3
              className="
                text-[12px]
                sm:text-[14px]
                md:text-[15px]

                font-semibold

                text-slate-400

                tracking-tight
              "
            >
              How can I help you?
            </h3>

            <p
              className="
                text-[10px]
                sm:text-[12px]
                md:text-[13px]

                text-slate-600

                max-w-[250px]
                sm:max-w-[280px]

                leading-relaxed

                mt-0.5
              "
            >
              Ask me anything — ideas, code, explanations or just a friend chat.
            </p>
          </div>

          <div
            className="
              flex
              flex-wrap
              justify-center

              gap-1.5
              sm:gap-2

              mt-1
            "
          >
            {[
              "What is Redis",
              "Build a application",
              "Write a code ... for me!",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="
                  text-[10px]
                  sm:text-[11px]
                  md:text-[12px]

                  text-slate-400

                  bg-white/[0.04]

                  border
                  border-white/[0.07]

                  px-2.5
                  sm:px-3
                  md:px-3.5

                  py-1.5

                  rounded-lg

                  hover:bg-white/[0.08]
                  hover:text-slate-200

                  transition-colors
                  duration-150

                  cursor-pointer
                "
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              <MessageBox
                role={message?.role}
                content={message?.content}
                images={message?.images || []}
              />
            </div>
          ))}

          {/* AI PROCESSING */}
          {isGenerating && <MessageBox role="assistant" isLoading={true} />}
        </div>
      )}
    </div>
  );
}

export default MessageList;
