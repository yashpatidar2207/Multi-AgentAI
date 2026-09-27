import {
  Code2Icon,
  FileTextIcon,
  GlobeIcon,
  ImagesIcon,
  MessageSquare,
  Mic,
  Paperclip,
  PresentationIcon,
  Send,
  X,
  ZapIcon,
  Maximize2,
  ChevronUp,
} from "lucide-react";

import React, { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import sendMessage from "../features/sendMessage";

import {
  addMessage,
  setArtifacts,
  setMessages,
} from "../redux/messageSlice.js";

import {
  addConversation,
  setConversationTitle,
  setSelectedConversation,
} from "../redux/conversationSlice.js";

import { createConversation } from "./../features/createConversation.js";

import { updateConversation } from "../features/updateConversation.js";

function ChatInput({ onGeneratingChange, onOpenArtifact }) {
  const [value, setValue] = useState("");

  const [selectedAgent, setSelectedAgent] = useState("Auto");

  const [selectedFile, setSelectedFile] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);

  const [showAgents, setShowAgents] = useState(false);

  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  const { selectedConversation } = useSelector((state) => state.conversation);

  const { artifacts } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  /* =====================================================
     AGENTS
  ===================================================== */

  const agents = [
    {
      id: "auto",
      icon: ZapIcon,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
    },
    {
      id: "coding",
      icon: Code2Icon,
      label: "Coding",
    },
    {
      id: "pdf",
      icon: FileTextIcon,
      label: "PDF",
    },
    {
      id: "ppt",
      icon: PresentationIcon,
      label: "PPT",
    },
    {
      id: "image",
      icon: ImagesIcon,
      label: "Image",
    },
    {
      id: "search",
      icon: GlobeIcon,
      label: "Search",
    },
  ];

  const selectedAgentData =
    agents.find((agent) => agent.label === selectedAgent) || agents[0];

  const SelectedAgentIcon = selectedAgentData.icon;

  /* =====================================================
     ARTIFACT AVAILABLE
  ===================================================== */

  const hasArtifact = artifacts?.some(
    (artifact) => artifact?.files && artifact.files.length > 0,
  );

  /* =====================================================
     FILE PREVIEW
  ===================================================== */

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    if (selectedFile.type?.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);

      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    setPreviewUrl(null);
  }, [selectedFile]);

  /* =====================================================
     TEXTAREA AUTO HEIGHT
  ===================================================== */

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    const maxHeight = window.innerWidth < 640 ? 110 : 170;

    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [value]);

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const handleSendMessage = async () => {
    const trimmedValue = value.trim();

    if (!trimmedValue && !selectedFile) {
      return;
    }

    let conversation = selectedConversation;

    try {
      /* CREATE CONVERSATION */

      if (!conversation) {
        dispatch(setMessages([]));

        const conv = await createConversation();

        dispatch(setSelectedConversation(conv));

        dispatch(addConversation(conv));

        conversation = conv;
      }

      /* UPDATE TITLE */

      if (conversation?.title === "New Chat") {
        const title = trimmedValue || selectedFile?.name || "New Chat";

        await updateConversation({
          id: conversation?._id,
          title,
        });

        dispatch(
          setConversationTitle({
            conversationId: conversation?._id,
            title: title.slice(0, 50),
          }),
        );
      }

      /* USER MESSAGE */

      dispatch(
        addMessage({
          role: "user",
          content: trimmedValue || selectedFile?.name || "",
        }),
      );

      /* FORM DATA */

      const formData = new FormData();

      formData.append("prompt", trimmedValue);

      formData.append("conversationId", conversation?._id);

      formData.append("agent", selectedAgent.toLowerCase());

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      /* START LOADING */

      onGeneratingChange?.(true);

      /* API */

      const data = await sendMessage(formData);

      /* CLEAR INPUT */

      setValue("");

      setSelectedFile(null);
      setPreviewUrl(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      /* ARTIFACT */

      dispatch(setArtifacts(data?.artifacts || []));

      /* AI RESPONSE */

      dispatch(
        addMessage({
          role: "assistant",
          content: data?.answer || "",
          images: data?.images || [],
        }),
      );

      console.log("AI Response:", data);
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      onGeneratingChange?.(false);
    }
  };

  /* =====================================================
     ENTER KEY
  ===================================================== */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSendMessage();
    }
  };

  /* =====================================================
     FILE SELECT
  ===================================================== */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };

  /* =====================================================
     REMOVE FILE
  ===================================================== */

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  /* =====================================================
     SELECT AGENT
  ===================================================== */

  const handleAgentSelect = (label) => {
    setSelectedAgent(label);
    setShowAgents(false);
  };

  return (
    <div
      className="
        relative
        w-full
        shrink-0

        px-2
        sm:px-3
        md:px-5

        py-2
        sm:py-3
        md:py-4

        border-t
        border-white/[0.06]

        bg-[#0d0f14]
      "
    >
      {/* =================================================
          ARTIFACT BUTTON

          ONLY SHOW WHEN ARTIFACT EXISTS
      ================================================= */}

      {hasArtifact && (
        <div
          className="
            flex
            justify-end

            mb-2

            relative
            z-20
          "
        >
          <button
            type="button"
            onClick={onOpenArtifact}
            title="Open artifact preview"
            aria-label="Open artifact preview"
            className="
              flex
              items-center
              justify-center

              w-9
              h-9

              rounded-xl

              bg-[#151821]

              border
              border-indigo-500/30

              text-indigo-400

              hover:bg-indigo-500/10
              hover:text-indigo-300

              active:scale-95

              transition-all
              duration-200

              cursor-pointer

              shadow-lg
              shadow-black/20
            "
          >
            <Maximize2 size={16} />
          </button>
        </div>
      )}

      {/* =================================================
          MAIN INPUT
      ================================================= */}

      <div
        className="
          relative

          flex
          flex-col
          gap-1.5

          bg-white/[0.03]

          border
          border-white/[0.07]

          rounded-2xl

          px-2.5
          sm:px-4

          pt-2.5
          sm:pt-3

          pb-2
          sm:pb-3
        "
      >
        {/* =================================================
            MOBILE AGENT SELECTOR
        ================================================= */}

        <div
          className="
            md:hidden

            flex
            items-center
            justify-end

            relative
          "
        >
          {/* AGENT MENU */}

          {showAgents && (
            <div
              className="
                absolute

                right-0
                bottom-[42px]

                z-50

                flex
                flex-col
                items-center

                gap-1

                p-1.5

                rounded-2xl

                bg-[#151821]

                border
                border-white/[0.08]

                shadow-2xl
                shadow-black/40

                animate-in
                fade-in
                slide-in-from-bottom-2

                duration-200
              "
            >
              {agents.map((agent) => {
                const Icon = agent.icon;

                const isActive = selectedAgent === agent.label;

                return (
                  <div
                    key={agent.id}
                    className="
                        relative
                        group
                      "
                  >
                    <button
                      type="button"
                      onClick={() => handleAgentSelect(agent.label)}
                      aria-label={agent.label}
                      className={`
                          flex
                          items-center
                          justify-center

                          w-7
                          h-7

                          rounded-lg

                          border

                          transition-all
                          duration-150

                          cursor-pointer

                          ${
                            isActive
                              ? `
                                bg-indigo-500
                                border-indigo-400
                                text-white
                                shadow-md
                                shadow-indigo-500/30
                              `
                              : `
                                bg-white/[0.03]
                                border-white/[0.06]
                                text-slate-500
                                hover:bg-white/[0.08]
                                hover:text-slate-200
                              `
                          }
                        `}
                    >
                      <Icon size={14} />
                    </button>

                    {/* CUSTOM TOOLTIP */}

                    <span
                      className="
                          pointer-events-none

                          absolute

                          right-[38px]
                          top-1/2
                          -translate-y-1/2

                          whitespace-nowrap

                          rounded-md

                          bg-[#1b1d24]

                          border
                          border-white/[0.08]

                          px-2
                          py-1

                          text-[10px]
                          text-slate-200

                          opacity-0
                          translate-x-1

                          group-hover:opacity-100
                          group-hover:translate-x-0

                          transition-all
                          duration-150

                          shadow-lg
                        "
                    >
                      {agent.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* SELECTED AGENT */}

          <button
            type="button"
            onClick={() => setShowAgents((previous) => !previous)}
            title={selectedAgentData.label}
            aria-label={selectedAgentData.label}
            className={`
              flex
              items-center
              justify-center

              w-8
              h-8

              rounded-lg

              border

              transition-all
              duration-200

              cursor-pointer

              ${
                showAgents
                  ? `
                    bg-indigo-500
                    border-indigo-400
                    text-white
                  `
                  : `
                    bg-indigo-500/10
                    border-indigo-500/30
                    text-indigo-400
                    hover:bg-indigo-500/20
                  `
              }
            `}
          >
            {showAgents ? (
              <ChevronUp size={15} />
            ) : (
              <SelectedAgentIcon size={15} />
            )}
          </button>
        </div>

        {/* =================================================
            DESKTOP AGENTS
        ================================================= */}

        <div
          className="
            hidden
            md:flex

            w-full

            gap-2

            pr-2

            flex-wrap
          "
        >
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label;

            const Icon = agent.icon;

            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelectedAgent(agent.label)}
                className={`
                    flex-shrink-0

                    cursor-pointer

                    inline-flex
                    items-center
                    justify-center

                    gap-1.5

                    px-3
                    py-2

                    rounded-full

                    text-xs
                    font-medium

                    border

                    transition-all
                    duration-150

                    ${
                      isActive
                        ? `
                          bg-gradient-to-r
                          from-gray-600
                          to-indigo-800

                          text-white

                          border-transparent

                          shadow-[0_1px_8px_rgba(99,102,241,.35)]
                        `
                        : `
                          bg-white/[0.03]
                          text-slate-400
                          border-white/[0.06]

                          hover:bg-white/[0.07]
                          hover:text-slate-200
                        `
                    }
                  `}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-white" : "text-slate-500"}
                />

                {agent.label}
              </button>
            );
          })}
        </div>

        {/* =================================================
            FILE PREVIEW
        ================================================= */}

        {selectedFile && (
          <div className="mt-1 sm:mt-2">
            <div
              className="
                inline-flex
                items-center

                gap-2

                max-w-full

                rounded-xl

                border
                border-white/10

                bg-white/[0.04]

                px-2
                sm:px-3

                py-1.5
                sm:py-2
              "
            >
              {/* IMAGE */}

              {selectedFile.type?.startsWith("image/") ? (
                <img
                  src={previewUrl || ""}
                  alt={selectedFile.name}
                  className="
                    w-8
                    h-8

                    sm:w-10
                    sm:h-10

                    rounded-lg

                    object-cover

                    shrink-0

                    border
                    border-white/10
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    items-center
                    justify-center

                    w-8
                    h-8

                    sm:w-10
                    sm:h-10

                    rounded-lg

                    bg-red-500/10

                    shrink-0
                  "
                >
                  <FileTextIcon size={16} className="text-red-300" />
                </div>
              )}

              {/* DETAILS */}

              <div
                className="
                  min-w-0

                  max-w-[150px]
                  sm:max-w-[240px]
                "
              >
                <p
                  className="
                    text-[10px]
                    sm:text-xs

                    text-white

                    truncate
                  "
                >
                  {selectedFile.name || "document"}
                </p>

                <p
                  className="
                    text-[9px]
                    sm:text-[10px]

                    text-slate-500
                  "
                >
                  {Math.ceil(selectedFile.size / 1024)} KB
                </p>
              </div>

              {/* REMOVE */}

              <button
                type="button"
                onClick={removeFile}
                className="
                  flex
                  items-center
                  justify-center

                  w-6
                  h-6

                  rounded-full

                  text-slate-500

                  hover:text-white
                  hover:bg-white/[0.08]

                  transition-all

                  cursor-pointer

                  shrink-0
                "
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            TEXTAREA
        ================================================= */}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Anything......."
          rows={1}
          className="
            w-full

            min-h-[42px]
            sm:min-h-[52px]

            max-h-[110px]
            sm:max-h-[170px]

            bg-transparent

            outline-none

            resize-none

            text-[12px]
            sm:text-[14px]

            text-slate-200

            placeholder:text-slate-600

            leading-relaxed

            py-2

            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        />

        {/* =================================================
            BOTTOM ACTIONS
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between

            pt-1
          "
        >
          {/* LEFT */}

          <div
            className="
              flex
              items-center

              gap-1
            "
          >
            <input
              type="file"
              accept=".pdf,image/*"
              hidden
              ref={fileRef}
              onChange={handleFileChange}
            />

            {/* ATTACHMENT */}

            <button
              type="button"
              title="Attach file"
              onClick={() => fileRef.current?.click()}
              className="
                flex
                items-center
                justify-center

                w-8
                h-8

                rounded-lg

                text-slate-600

                hover:text-slate-400
                hover:bg-white/[0.05]

                transition-all

                cursor-pointer

                bg-transparent
              "
            >
              <Paperclip size={16} />
            </button>

            {/* MICROPHONE */}

            <button
              type="button"
              title="Voice input"
              className="
                flex
                items-center
                justify-center

                w-8
                h-8

                rounded-lg

                text-slate-600

                hover:text-slate-400
                hover:bg-white/[0.05]

                transition-all

                cursor-pointer

                bg-transparent
              "
            >
              <Mic size={16} />
            </button>
          </div>

          {/* SEND */}

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!value.trim() && !selectedFile}
            title="Send message"
            className={`
              flex
              items-center
              justify-center

              w-8
              h-8

              rounded-lg

              border-none

              transition-all
              duration-150

              ${
                value.trim() || selectedFile
                  ? `
                    bg-gradient-to-br
                    from-indigo-500
                    to-violet-700

                    hover:opacity-90

                    text-white

                    cursor-pointer

                    shadow-md
                    shadow-indigo-500/20
                  `
                  : `
                    bg-white/[0.05]

                    text-slate-600

                    cursor-not-allowed
                  `
              }
            `}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
