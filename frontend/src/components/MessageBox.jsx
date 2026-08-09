import React from "react";

function MessageBox({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} pt-1.5`}>
      <div
        className={`w-fit max-w-[92vw] md:max-w-[72%]
                  px-4 py-2.5 rounded-2xl
                  break-words overflow-hidden
                  leading-relaxed
        ${
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
            : " text-slate-200 rounded-tl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default MessageBox;
