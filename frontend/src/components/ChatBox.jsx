import React, { useEffect, useState } from "react";

import Nav from "./Nav";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

import getMessages from "./../features/getMessages.js";

import { useSelector, useDispatch } from "react-redux";

import { setArtifacts, setMessages } from "../redux/messageSlice.js";

function ChatBox({ onOpenArtifact }) {
  const { selectedConversation } = useSelector((state) => state.conversation);

  const dispatch = useDispatch();

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsGenerating(false);

    if (!selectedConversation || selectedConversation?.title === "New Chat") {
      dispatch(setMessages([]));
      dispatch(setArtifacts([]));

      return;
    }

    const getMsgs = async () => {
      try {
        if (!selectedConversation) return;

        const data = await getMessages(selectedConversation?._id);

        dispatch(setMessages(data));

        const latestArtifactMsg = [...data]
          .reverse()
          .find(
            (message) => message?.artifacts && message.artifacts.length > 0,
          );

        dispatch(setArtifacts(latestArtifactMsg?.artifacts || []));
      } catch (error) {
        console.error("Error while fetching messages:", error);
      }
    };

    getMsgs();
  }, [selectedConversation?._id, dispatch]);

  return (
    <div
      className="
        w-full
        h-full
        min-w-0
        min-h-0
        flex
        flex-col
        overflow-hidden
        bg-[#0d0f14]
      "
    >
      {/* Header */}
      <div className="shrink-0">
        <Nav />
      </div>

      {/* Scrollable Messages */}
      <MessageList isGenerating={isGenerating} />

      {/* Fixed Bottom Composer Area */}
      <div className="shrink-0">
        <ChatInput
          onGeneratingChange={setIsGenerating}
          onOpenArtifact={onOpenArtifact}
        />
      </div>
    </div>
  );
}

export default ChatBox;
