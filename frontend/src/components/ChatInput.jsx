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
  MicOff,
  ChevronsUp,
} from "lucide-react";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

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

import {
  createConversation,
} from "./../features/createConversation.js";

import {
  updateConversation,
} from "../features/updateConversation.js";

function ChatInput({
  onGeneratingChange,
  onOpenArtifact,
}) {
  /* =====================================================
     BASIC STATE
  ===================================================== */

  const [value, setValue] = useState("");

  const [selectedAgent, setSelectedAgent] =
    useState("Auto");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState(null);

  const [showAgents, setShowAgents] =
    useState(false);

  /* =====================================================
     VOICE STATE
  ===================================================== */

  const [isListening, setIsListening] =
    useState(false);

  const recognitionRef = useRef(null);

  const valueRef = useRef("");

  const speechBaseValueRef =
    useRef("");

  const finalTranscriptRef =
    useRef("");

  const shouldKeepListeningRef =
    useRef(false);

  const fileRef = useRef(null);

  const textareaRef = useRef(null);

  /* =====================================================
     REDUX
  ===================================================== */

  const {
    selectedConversation,
  } = useSelector(
    (state) => state.conversation
  );

  const {
    artifacts,
  } = useSelector(
    (state) => state.message
  );

  const dispatch = useDispatch();

  /* =====================================================
     KEEP VALUE REF UPDATED
  ===================================================== */

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  /* =====================================================
     PLACEHOLDERS
  ===================================================== */

  const placeholders = {
    auto: "Ask to Multi AI...",
    chat: "Chat with Multi AI...",
    coding:
      "Describe the software you want...",
    pdf: "Generate a PDF about...",
    ppt: "Create a presentation about...",
    image: "Describe the image...",
    search: "Search the web...",
  };

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
    agents.find(
      (agent) =>
        agent.label === selectedAgent
    ) || agents[0];

  const SelectedAgentIcon =
    selectedAgentData.icon;

  /* =====================================================
     ARTIFACT AVAILABLE
  ===================================================== */

  const hasArtifact =
    artifacts?.some(
      (artifact) =>
        artifact?.files &&
        artifact.files.length > 0
    );

  /* =====================================================
     FILE PREVIEW
  ===================================================== */

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    if (
      selectedFile.type?.startsWith(
        "image/"
      )
    ) {
      const url =
        URL.createObjectURL(
          selectedFile
        );

      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    setPreviewUrl(null);
  }, [selectedFile]);

  /* =====================================================
     TEXTAREA
  ===================================================== */

  useEffect(() => {
    const textarea =
      textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    /*
     * Mobile and desktop both remain compact.
     * It can still grow slightly if needed.
     */
    const maxHeight =
      window.innerWidth < 640
        ? 90
        : 140;

    textarea.style.height =
      `${Math.min(
        textarea.scrollHeight,
        maxHeight
      )}px`;
  }, [value]);

  /* =====================================================
     SPEECH RECOGNITION
  ===================================================== */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.interimResults =
      true;

    recognition.continuous = true;

    /* =================================================
       START
    ================================================= */

    recognition.onstart = () => {
      setIsListening(true);

      speechBaseValueRef.current =
        valueRef.current;

      finalTranscriptRef.current =
        "";
    };

    /* =================================================
       RESULT
    ================================================= */

    recognition.onresult = (
      event
    ) => {
      let interimTranscript = "";

      let finalTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i]?.[0]
            ?.transcript || "";

        if (
          event.results[i].isFinal
        ) {
          finalTranscript +=
            transcript;
        } else {
          interimTranscript +=
            transcript;
        }
      }

      if (finalTranscript) {
        finalTranscriptRef.current +=
          finalTranscript;
      }

      const combinedValue =
        speechBaseValueRef.current +
        finalTranscriptRef.current +
        interimTranscript;

      setValue(combinedValue);

      valueRef.current =
        combinedValue;
    };

    /* =================================================
       ERROR
    ================================================= */

    recognition.onerror = (
      event
    ) => {
      if (
        event.error !==
          "no-speech" &&
        event.error !==
          "aborted"
      ) {
        console.error(
          "Speech recognition error:",
          event.error
        );
      }
    };

    /* =================================================
       END
    ================================================= */

    recognition.onend = () => {
      if (
        shouldKeepListeningRef.current
      ) {
        try {
          recognition.start();
          return;
        } catch (error) {
          // Browser may already be restarting.
        }
      }

      setIsListening(false);
    };

    recognitionRef.current =
      recognition;

    return () => {
      shouldKeepListeningRef.current =
        false;

      try {
        recognition.stop();
      } catch (error) {
        // Ignore cleanup errors.
      }

      recognitionRef.current =
        null;
    };
  }, []);

  /* =====================================================
     MICROPHONE
  ===================================================== */

  const toggleMic = () => {
    const recognition =
      recognitionRef.current;

    if (!recognition) {
      alert(
        "Speech Recognition not supported in this browser."
      );

      return;
    }

    /* STOP */

    if (isListening) {
      shouldKeepListeningRef.current =
        false;

      try {
        recognition.stop();
      } catch (error) {
        console.log(
          "Speech recognition stop error:",
          error
        );
      }

      setIsListening(false);

      return;
    }

    /* START */

    speechBaseValueRef.current =
      valueRef.current;

    finalTranscriptRef.current =
      "";

    shouldKeepListeningRef.current =
      true;

    try {
      recognition.start();
    } catch (error) {
      console.log(
        "Speech recognition start error:",
        error
      );
    }
  };

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const handleSendMessage =
    async () => {
      /* -----------------------------------------------
         STOP MICROPHONE
      ----------------------------------------------- */

      if (isListening) {
        shouldKeepListeningRef.current =
          false;

        try {
          recognitionRef.current?.stop();
        } catch (error) {
          // Ignore
        }

        setIsListening(false);
      }

      /* -----------------------------------------------
         CAPTURE CURRENT VALUES
      ----------------------------------------------- */

      const trimmedValue =
        value.trim();

      /*
       * IMPORTANT:
       * Capture file before clearing state.
       */
      const currentFile =
        selectedFile;

      /* -----------------------------------------------
         VALIDATION
      ----------------------------------------------- */

      if (
        !trimmedValue &&
        !currentFile
      ) {
        return;
      }

      let conversation =
        selectedConversation;

      try {
        /* ===============================================
           CREATE CONVERSATION
        =============================================== */

        if (!conversation) {
          dispatch(
            setMessages([])
          );

          const conv =
            await createConversation();

          dispatch(
            setSelectedConversation(
              conv
            )
          );

          dispatch(
            addConversation(conv)
          );

          conversation = conv;
        }

        /* ===============================================
           UPDATE TITLE
        =============================================== */

        if (
          conversation?.title ===
          "New Chat"
        ) {
          const title =
            trimmedValue ||
            currentFile?.name ||
            "New Chat";

          await updateConversation({
            id: conversation?._id,
            title,
          });

          dispatch(
            setConversationTitle({
              conversationId:
                conversation?._id,
              title:
                title.slice(0, 50),
            })
          );
        }

        /* ===============================================
           USER MESSAGE

           User message is added immediately.
        =============================================== */

        dispatch(
          addMessage({
            role: "user",
            content:
              trimmedValue ||
              currentFile?.name ||
              "",
          })
        );

        /* ===============================================
           FORM DATA

           Create FormData BEFORE clearing file state.
        =============================================== */

        const formData =
          new FormData();

        formData.append(
          "prompt",
          trimmedValue
        );

        formData.append(
          "conversationId",
          conversation?._id
        );

        formData.append(
          "agent",
          selectedAgent.toLowerCase()
        );

        if (currentFile) {
          formData.append(
            "file",
            currentFile
          );
        }

        /* ===============================================
           IMPORTANT:

           CLEAR INPUT IMMEDIATELY.

           Do NOT wait for AI response.
        =============================================== */

        setValue("");

        valueRef.current = "";

        setSelectedFile(null);

        setPreviewUrl(null);

        speechBaseValueRef.current =
          "";

        finalTranscriptRef.current =
          "";

        if (fileRef.current) {
          fileRef.current.value =
            "";
        }

        /* ===============================================
           START GENERATION
        =============================================== */

        onGeneratingChange?.(
          true
        );

        /* ===============================================
           API REQUEST
        =============================================== */

        const data =
          await sendMessage(
            formData
          );

        /* ===============================================
           ARTIFACT
        =============================================== */

        dispatch(
          setArtifacts(
            data?.artifacts || []
          )
        );

        /* ===============================================
           AI RESPONSE
        =============================================== */

        dispatch(
          addMessage({
            role: "assistant",
            content:
              data?.answer || "",
            images:
              data?.images || [],
          })
        );

        console.log(
          "AI Response:",
          data
        );
      } catch (error) {
        console.error(
          "Send message error:",
          error
        );

        /*
         * IMPORTANT:
         *
         * Do NOT restore the input here.
         *
         * The user's message has already
         * been added to the chat.
         */
      } finally {
        onGeneratingChange?.(
          false
        );
      }
    };

  /* =====================================================
     ENTER KEY
  ===================================================== */

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleSendMessage();
    }
  };

  /* =====================================================
     FILE SELECT
  ===================================================== */

  const handleFileChange = (
    e
  ) => {
    const file =
      e.target.files?.[0];

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
      fileRef.current.value =
        "";
    }
  };

  /* =====================================================
     SELECT AGENT
  ===================================================== */

  const handleAgentSelect = (
    label
  ) => {
    setSelectedAgent(label);

    setShowAgents(false);
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div
      className="
        relative
        w-full
        shrink-0

        px-2
        sm:px-3
        md:px-5

        pt-1
        sm:pt-2
        md:pt-3

        pb-2
        sm:pb-3

        bg-transparent

        md:bg-[#0d0f14]
      "
    >
      {/* =================================================
          ARTIFACT BUTTON
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
            onClick={
              onOpenArtifact
            }
            title="Open artifact preview"
            aria-label="Open artifact preview"
            className="
              flex
              items-center
              justify-center

              w-8
              h-8

              rounded-full

              bg-[#151821]

              border
              border-white/[0.08]

              text-slate-400

              hover:bg-white/[0.06]
              hover:text-slate-200

              active:scale-95

              transition-all

              cursor-pointer
            "
          >
            <Maximize2
              size={14}
            />
          </button>
        </div>
      )}

      {/* =================================================
          MAIN INPUT WRAPPER

          MOBILE:
          Transparent.

          DESKTOP:
          Original subtle container.
      ================================================= */}

      <div
        className="
          relative

          flex
          flex-col

          gap-0

          bg-transparent

          border-transparent

          rounded-none

          px-0
          py-0

          md:gap-1.5

          md:bg-white/[0.03]

          md:border
          md:border-white/[0.07]

          md:rounded-2xl

          md:px-2.5
          md:py-2.5
        "
      >
        {/* =================================================
            DESKTOP AGENTS
        ================================================= */}

        <div
          className="
            hidden
            md:flex

            items-center

            gap-1.5

            w-full

            overflow-x-auto

            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {agents.map(
            (agent) => {
              const isActive =
                selectedAgent ===
                agent.label;

              const Icon =
                agent.icon;

              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() =>
                    setSelectedAgent(
                      agent.label
                    )
                  }
                  className={`
                    shrink-0

                    inline-flex
                    items-center
                    justify-center

                    gap-1.5

                    px-3
                    py-1.5

                    rounded-full

                    text-xs
                    font-medium

                    border

                    transition-all
                    duration-150

                    cursor-pointer

                    ${
                      isActive
                        ? `
                          bg-white/[0.10]

                          text-slate-100

                          border-white/[0.12]

                          shadow-sm
                        `
                        : `
                          bg-transparent

                          text-slate-400

                          border-white/[0.06]

                          hover:bg-white/[0.04]
                          hover:text-slate-200
                        `
                    }
                  `}
                >
                  <Icon
                    size={14}
                  />

                  {agent.label}
                </button>
              );
            }
          )}
        </div>

        {/* =================================================
            MOBILE AGENT SELECTOR

            IMPORTANT:
            Absolute positioning means it DOES NOT
            reserve vertical space.

            Therefore the black/dark horizontal
            agent area is removed.
        ================================================= */}

        <div
          className="
            md:hidden

            absolute

            right-0

            bottom-full

            mb-1

            z-50
          "
        >
          {/* =================================================
              MOBILE AGENT MENU
          ================================================= */}

          {showAgents && (
            <div
              className="
                absolute

                right-0

                bottom-[36px]

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
              "
            >
              {agents.map(
                (agent) => {
                  const Icon =
                    agent.icon;

                  const isActive =
                    selectedAgent ===
                    agent.label;

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
                        onClick={() =>
                          handleAgentSelect(
                            agent.label
                          )
                        }
                        title={
                          agent.label
                        }
                        aria-label={
                          agent.label
                        }
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
                                bg-white/[0.12]

                                border-white/[0.15]

                                text-white
                              `
                              : `
                                bg-transparent

                                border-white/[0.06]

                                text-slate-500

                                hover:bg-white/[0.06]

                                hover:text-slate-200
                              `
                          }
                        `}
                      >
                        <Icon
                          size={14}
                        />
                      </button>

                      {/* Tooltip */}

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
                }
              )}
            </div>
          )}

          {/* =================================================
              SELECTED AGENT BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setShowAgents(
                (previous) =>
                  !previous
              )
            }
            title={
              selectedAgentData.label
            }
            aria-label={
              selectedAgentData.label
            }
            className="
              flex
              items-center
              justify-center

              w-8
              h-8

              rounded-full

              bg-transparent

              border
              border-white/[0.10]

              text-slate-400

              hover:bg-white/[0.05]

              hover:text-slate-200

              transition-all

              cursor-pointer
            "
          >
            {showAgents ? (
              <ChevronsUp
                size={15}
              />
            ) : (
              <SelectedAgentIcon
                size={15}
              />
            )}
          </button>
        </div>

        {/* =================================================
            ACTUAL INPUT BOX

            ONLY THIS PART HAS GRAY BACKGROUND.
        ================================================= */}

        <div
          className="
            relative

            flex
            items-center

            w-full

            min-h-[44px]

            sm:min-h-[46px]

            md:min-h-[48px]

            bg-[#2f2f2f]

            border
            border-white/[0.08]

            rounded-[17px]

            sm:rounded-[18px]

            md:rounded-[20px]

            px-2

            sm:px-2.5

            shadow-sm
          "
        >
          {/* =================================================
              FILE PREVIEW
          ================================================= */}

          {selectedFile && (
            <div
              className="
                absolute

                left-2

                bottom-[48px]

                z-20
              "
            >
              <div
                className="
                  flex
                  items-center

                  gap-2

                  rounded-xl

                  border
                  border-white/10

                  bg-[#1b1d21]

                  px-2

                  py-1.5
                "
              >
                {selectedFile.type?.startsWith(
                  "image/"
                ) ? (
                  <img
                    src={
                      previewUrl || ""
                    }
                    alt={
                      selectedFile.name
                    }
                    className="
                      w-7
                      h-7

                      rounded-md

                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      items-center
                      justify-center

                      w-7
                      h-7

                      rounded-md

                      bg-red-500/10
                    "
                  >
                    <FileTextIcon
                      size={14}
                      className="text-red-300"
                    />
                  </div>
                )}

                <span
                  className="
                    max-w-[130px]

                    truncate

                    text-[10px]

                    text-slate-300
                  "
                >
                  {selectedFile.name}
                </span>

                <button
                  type="button"
                  onClick={
                    removeFile
                  }
                  className="
                    flex
                    items-center
                    justify-center

                    w-5
                    h-5

                    rounded-full

                    text-slate-500

                    hover:text-white

                    cursor-pointer
                  "
                >
                  <X size={12} />
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
            onChange={(e) => {
              const newValue =
                e.target.value;

              setValue(newValue);

              valueRef.current =
                newValue;
            }}
            onKeyDown={
              handleKeyDown
            }
            placeholder={
              placeholders[
                selectedAgent.toLowerCase()
              ]
            }
            rows={1}
            className="
              flex-1

              min-w-0

              min-h-[40px]

              max-h-[90px]

              bg-transparent

              outline-none

              resize-none

              overflow-y-auto

              text-[13px]

              sm:text-[14px]

              text-slate-100

              placeholder:text-slate-500

              leading-[40px]

              px-1

              py-0

              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          />

          {/* =================================================
              ACTION BUTTONS

              Paperclip + Mic + Send
              remain in same row.
          ================================================= */}

          <div
            className="
              flex
              items-center

              gap-0

              shrink-0
            "
          >
            {/* FILE INPUT */}

            <input
              type="file"
              accept=".pdf,image/*"
              hidden
              ref={fileRef}
              onChange={
                handleFileChange
              }
            />

            {/* =================================================
                PAPERCLIP
            ================================================= */}

            <button
              type="button"
              title="Attach file"
              aria-label="Attach file"
              onClick={() =>
                fileRef.current?.click()
              }
              className="
                flex
                items-center
                justify-center

                w-7
                h-7

                sm:w-8
                sm:h-8

                rounded-full

                bg-transparent

                text-slate-400

                hover:bg-white/[0.06]

                hover:text-slate-200

                active:scale-95

                transition-all

                cursor-pointer
              "
            >
              <Paperclip
                size={15}
              />
            </button>

            {/* =================================================
                MICROPHONE
            ================================================= */}

            <button
              type="button"
              onClick={toggleMic}
              title={
                isListening
                  ? "Stop listening"
                  : "Voice input"
              }
              aria-label={
                isListening
                  ? "Stop listening"
                  : "Voice input"
              }
              className={`
                flex
                items-center
                justify-center

                w-7
                h-7

                sm:w-8
                sm:h-8

                rounded-full

                transition-all

                cursor-pointer

                ${
                  isListening
                    ? `
                      bg-red-500/15

                      text-red-400
                    `
                    : `
                      bg-transparent

                      text-slate-400

                      hover:bg-white/[0.06]

                      hover:text-slate-200
                    `
                }
              `}
            >
              {isListening ? (
                <MicOff
                  size={15}
                />
              ) : (
                <Mic size={15} />
              )}
            </button>

            {/* =================================================
                SEND BUTTON

                FULLY ROUND
            ================================================= */}

            <button
              type="button"
              onClick={
                handleSendMessage
              }
              disabled={
                !value.trim() &&
                !selectedFile
              }
              title="Send message"
              aria-label="Send message"
              className={`
                flex
                items-center
                justify-center

                w-8
                h-8

                sm:w-9
                sm:h-9

                ml-0.5

                rounded-full

                border-none

                shrink-0

                transition-all
                duration-150

                ${
                  value.trim() ||
                  selectedFile
                    ? `
                      bg-[#3b82f6]

                      text-white

                      hover:bg-[#2563eb]

                      active:scale-90

                      cursor-pointer
                    `
                    : `
                      bg-white/[0.07]

                      text-slate-600

                      cursor-not-allowed
                    `
                }
              `}
            >
              <Send
                size={14}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;