import { Code2Icon, FileTextIcon, GlobeIcon, Icon, ImagesIcon, MessageSquare, Mic, MicOff, Paperclip, PresentationIcon, Send, ZapIcon } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import sendMessage from "../features/sendMessage";
import { addMessage, setMessages } from "../redux/messageSlice.js";
import { addConversation, setConversationTitle, setSelectedConversation } from "../redux/conversationSlice.js";
import { createConversation} from './../features/createConversation.js';
import { updateConversation } from "../features/updateConversation.js";

function ChatInput() {
  const [value, setValue] = useState("");
  const [selectedAgent,setSelectedAgent]=useState("Auto")

  const {selectedConversation}=useSelector(state=>state.conversation)
  const dispatch = useDispatch();
  
  const handleSendMessage = async ()=>{

    let conversation = selectedConversation

    if(!conversation){
      dispatch(setMessages([]))

      const conv = await createConversation()
      dispatch(setSelectedConversation(conv))
      dispatch(addConversation(conv))
      conversation=conv
    }

    if(conversation?.title=="New Chat"){
      await updateConversation({id:conversation?._id,title:value})
      dispatch(setConversationTitle({conversationId:conversation?._id, title:value.slice(0,50)}))
    }

    const payload = {
      prompt:value.trim(),
      conversationId:conversation?._id,
      agent:selectedAgent.toLowerCase()
    }
    dispatch(addMessage({role:"user",content:value.trim()}))
    const data = await sendMessage(payload)
    setValue("")
    dispatch(addMessage({role:"assistant",content:data?.answer,images:data?.images}))
    console.log(data)
  }

     const agents = [

  {
    id:"auto",
    icon:ZapIcon,
    label:"Auto"
  },

  {
    id:"chat",
    icon:MessageSquare,
    label:"Chat"
  },

  {
    id:"coding",
    icon:Code2Icon,
    label:"Coding"
  },

  {
    id:"pdf",
    icon:FileTextIcon,
    label:"PDF"
  },

  {
    id:"ppt",
    icon:PresentationIcon,
    label:"PPT"
  },

  {
    id:"image",
    icon:ImagesIcon,
    label:"Image"
  },

  {
    id:"search",
    icon:GlobeIcon,
    label:"Search"
  }

];
  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">

      <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
        {
          agents.map((agent)=>{
            const isActive = selectedAgent === agent.label
            const Icon=agent.icon
          
        return (

        <button
          key={agent.id}
          onClick={()=>setSelectedAgent(agent.label)}
          className={`
            flex-shrink-0
            cursor-pointer
            inline-flex
            items-center
            gap-1.5
            px-3
            py-2
            rounded-full
            text-xs
            font-medium
            border
            transition-all

            ${
              isActive
                ? "bg-linear-to-r from-gray-600 to-indigo-800 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
            }
          `}
        >

          <Icon
            size={14}
            className={
              isActive
                ? "text-white"
                : "text-slate-500"
            }
          />

          {agent.label}

        </button>

      );
          })
        }
      </div>
        <textarea
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder={"Ask Anything......."}
          rows={3}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
              <Paperclip size={14} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer">
              <Mic size={14} />
            </button>
          </div>
          <button
          onClick={handleSendMessage}
            disabled={!value.trim()}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150
                ${value.trim()
                ? "bg-gradient-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white"
                : "bg-white/[0.05] text-slate-600 cursor-not-allowed"}`}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
