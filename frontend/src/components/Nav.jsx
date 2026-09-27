import React from "react";

import { MessageSquare, Sparkles } from "lucide-react";

import { useSelector } from "react-redux";

function Nav() {
  const { selectedConversation } = useSelector((state) => state.conversation);

  const { messages, artifacts } = useSelector((state) => state.message);

  if (!selectedConversation) {
    return null;
  }

  return (
    <div
      className="
        h-14
        shrink-0
        flex
        items-center
        justify-between

        pl-16
        pr-3

        sm:pl-16
        sm:pr-4

        lg:pl-5
        lg:pr-5

        border-b
        border-white/[0.06]

        bg-[#0d0f14]
      "
    >
      {/* LEFT */}
      <div
        className="
          flex
          items-center
          gap-2

          min-w-0
          overflow-hidden
        "
      >
        <div
          className="
            flex
            items-center
            justify-center

            w-7
            h-7

            rounded-lg

            bg-indigo-500/10
            border
            border-indigo-500/20

            shrink-0
          "
        >
          <MessageSquare size={13} className="text-indigo-400" />
        </div>

        <h2
          className="
            text-[12px]
            sm:text-[13px]
            md:text-[14px]

            font-semibold
            text-slate-100

            tracking-tight

            truncate

            max-w-[48vw]
            sm:max-w-[55vw]
            lg:max-w-[35vw]
          "
        >
          {selectedConversation?.title}
        </h2>

        <span
          className="
            hidden
            sm:inline-flex

            text-[10px]
            font-medium

            text-slate-600

            bg-white/[0.04]

            border
            border-white/[0.06]

            px-2
            py-0.5

            rounded-full

            whitespace-nowrap
          "
        >
          {messages.length} Messages
        </span>
      </div>

      {/* RIGHT */}
      {artifacts?.length > 0 && (
        <div
          className="
            lg:hidden

            flex
            items-center
            justify-center

            w-8
            h-8

            rounded-lg

            bg-indigo-500/10
            border
            border-indigo-500/20

            text-indigo-400

            shrink-0
          "
          title="Artifact available"
        >
          <Sparkles size={15} />
        </div>
      )}
    </div>
  );
}

export default Nav;
