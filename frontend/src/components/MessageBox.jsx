import React from "react";
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm";
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
            ? "bg-gradient-to-br from-indigo-400 to-indigo-600 text-white rounded-tr-sm"
            : "bg-gradient-to-br from-gray-500 to-gray-700 text-slate-200 rounded-tl-sm"
        }`}
      >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
        
      </div>
    </div>
  );
}

export default MessageBox;
