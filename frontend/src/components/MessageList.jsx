import React from 'react'
import { useSelector } from 'react-redux';
import MessageBox from './MessageBox';

function MessageList() {
  const { selectedConversation } = useSelector(
    (state) => state.conversation,
  );
  const {messages}=useSelector(state=>state.message)

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {
      messages?.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[20px] font-semibold text-slate-200 tracking-tight">MultiAgentAI</h1>
            <h3 className="text-[15px] font-semibold text-slate-400 tracking-tight">How can I help you?</h3>
            <p className="text-[13px] text-slate-600 max-w-[260px] leading-relaxed">Ask me anything — ideas, code, explanations or just a friend chat.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {["What is Redis", "Build a application" , "Write a code ... for me!"].map((s) => (
              <button
                key={s}
                className="text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3.5 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )
      :
      (
        <div>
          { messages?.map((message,i) => (
            <div>
            <MessageBox role={message?.role}  content={message?.content}/>
            </div>
          ))
          }
        </div>
      )
    }

    </div>
  )
}

export default MessageList