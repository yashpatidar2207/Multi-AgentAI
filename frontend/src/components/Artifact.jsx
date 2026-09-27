import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import Editor from "@monaco-editor/react";

import { FiCode } from "react-icons/fi";

import {
  Check,
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  X,
} from "lucide-react";

import { AnimatePresence, easeInOut, motion } from "framer-motion";

import { detectLanguage } from "./../../utils/detectLanguage.js";

export default function Artifact({ mobileOpen, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);

  const [tab, setTab] = useState("code");

  const [activeFile, setActiveFile] = useState(0);

  const [copied, setCopied] = useState(false);

  const { artifacts } = useSelector((state) => state.message);

  const artifact = artifacts?.[0];

  const hasArtifact = Boolean(artifact?.files?.length);

  /* =====================================================
     RESET ACTIVE FILE
  ===================================================== */

  useEffect(() => {
    setActiveFile(0);
    setTab("code");
  }, [artifact]);

  /* =====================================================
     CLOSE MOBILE DRAWER WHEN
     ARTIFACT DISAPPEARS
  ===================================================== */

  useEffect(() => {
    if (!hasArtifact) {
      setMobileOpen?.(false);
    }
  }, [hasArtifact, setMobileOpen]);

  if (!hasArtifact) {
    return null;
  }

  const file = artifact?.files?.[activeFile];

  const htmlFile = artifact?.files?.find((f) => f.name === "index.html");

  const cssFile = artifact?.files?.find((f) => f.name === "style.css");

  const jsFile = artifact?.files?.find((f) => f.name === "script.js");

  const canPreview = Boolean(htmlFile);

  const previewDoc = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta
  name="viewport"
  content="width=device-width,initial-scale=1.0"
/>

<style>
${cssFile?.content || ""}
</style>

</head>

<body>

${htmlFile?.content || ""}

<script>
${jsFile?.content || ""}
</script>

</body>
</html>
`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file?.content || "");

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.log("Copy failed:", error);
    }
  };

  /* =====================================================
     ARTIFACT CONTENT
  ===================================================== */

  const ArtifactContent = ({ mobile = false }) => (
    <div
      className="
        flex
        flex-col

        h-full
        min-h-0

        bg-[#0d0f14]
      "
    >
      {/* HEADER */}

      <div
        className="
          h-14
          shrink-0

          px-3
          sm:px-4

          border-b
          border-white/[0.06]

          flex
          items-center

          gap-2
        "
      >
        <button
          onClick={() => {
            if (mobile) {
              setMobileOpen?.(false);
            } else {
              setCollapsed(true);
            }
          }}
          className="
            flex
            items-center
            justify-center

            w-7
            h-7

            rounded-lg

            text-slate-500

            hover:text-slate-200
            hover:bg-white/[0.05]

            transition-colors

            cursor-pointer

            shrink-0
          "
        >
          {mobile ? <X size={17} /> : <PanelRightClose size={16} />}
        </button>

        {/* TITLE */}

        <div
          className="
            flex
            items-center
            gap-2

            flex-1
            min-w-0
          "
        >
          <div
            className="
              flex
              items-center
              justify-center

              w-6
              h-6

              rounded-md

              bg-indigo-500/10

              border
              border-indigo-500/20

              shrink-0
            "
          >
            <FiCode className="text-indigo-400" size={10} />
          </div>

          <h2
            className="
              text-[13px]

              font-medium

              text-slate-200

              truncate
            "
          >
            {artifact?.title}
          </h2>
        </div>

        {/* ACTIONS */}

        <div
          className="
            flex
            items-center

            gap-1

            shrink-0
          "
        >
          {/* COPY */}

          {tab === "code" && (
            <button
              onClick={handleCopy}
              title="Copy code"
              className="
                flex
                items-center
                justify-center

                gap-1.5

                px-2
                sm:px-2.5

                py-1.5

                text-[11px]

                font-medium

                text-slate-400

                hover:text-slate-200
                hover:bg-white/[0.05]

                rounded-lg

                cursor-pointer
              "
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-400" />

                  <span className="hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />

                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          )}

          {/* CODE / PREVIEW */}

          {canPreview && (
            <div
              className="
                flex
                items-center
                gap-1

                bg-white/[0.04]

                border
                border-white/[0.06]

                p-1

                rounded-lg
              "
            >
              <button
                onClick={() => setTab("code")}
                className={`
                  flex
                  items-center
                  justify-center

                  gap-1.5

                  px-2
                  py-1

                  text-[10px]
                  sm:text-[11px]

                  font-medium

                  rounded-md

                  ${
                    tab === "code"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-500 hover:text-slate-200"
                  }
                `}
              >
                <Code2 size={11} />

                <span className="hidden sm:inline">Code</span>
              </button>

              <button
                onClick={() => setTab("preview")}
                className={`
                  flex
                  items-center
                  justify-center

                  gap-1.5

                  px-2
                  py-1

                  text-[10px]
                  sm:text-[11px]

                  font-medium

                  rounded-md

                  ${
                    tab === "preview"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-500 hover:text-slate-200"
                  }
                `}
              >
                <Eye size={11} />

                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FILE TABS */}

      <AnimatePresence>
        {tab === "code" && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              flex

              border-b
              border-white/[0.06]

              overflow-x-auto

              shrink-0

              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {artifact?.files?.map((currentFile, index) => (
              <button
                key={currentFile?.name}
                onClick={() => setActiveFile(index)}
                className={`
                    relative

                    px-3
                    sm:px-4

                    py-2.5

                    text-[10px]
                    sm:text-[11px]

                    font-medium

                    whitespace-nowrap

                    border-r
                    border-white/[0.05]

                    cursor-pointer

                    ${
                      activeFile === index
                        ? "text-indigo-400"
                        : "text-slate-500 hover:text-slate-300"
                    }
                  `}
              >
                {currentFile?.name}

                {activeFile === index && (
                  <motion.div
                    layoutId={mobile ? "mobile-file-tab" : "desktop-file-tab"}
                    className="
                        absolute

                        bottom-0
                        left-0
                        right-0

                        h-[2px]

                        bg-indigo-500

                        rounded-t-full
                      "
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDITOR / PREVIEW */}

      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "preview" && canPreview ? (
            <motion.div
              key="preview"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.15,
              }}
              className="w-full h-full"
            >
              <iframe
                title="artifact-preview"
                sandbox="allow-scripts"
                srcDoc={previewDoc}
                className="
                  w-full
                  h-full

                  bg-white

                  border-0
                "
              />
            </motion.div>
          ) : (
            <motion.div
              key={`code-${activeFile}`}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.15,
              }}
              className="w-full h-full"
            >
              <Editor
                theme="vs-dark"
                language={detectLanguage(file?.name || "")}
                value={file?.content || ""}
                options={{
                  readOnly: true,

                  minimap: {
                    enabled: false,
                  },

                  fontSize: 11,

                  wordWrap: "on",

                  automaticLayout: true,

                  scrollBeyondLastLine: false,

                  padding: {
                    top: 16,
                  },

                  lineNumbers: mobile ? "off" : "on",

                  renderLineHighlight: "none",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* =================================================
          DESKTOP ARTIFACT
      ================================================= */}

      <motion.aside
        layout
        className={`
          hidden
          lg:flex

          h-full

          shrink-0

          border-l
          border-white/[0.06]

          overflow-hidden

          ${collapsed ? "w-10" : "w-[380px] xl:w-[450px]"}
        `}
        transition={{
          duration: 0.3,
          ease: easeInOut,
        }}
      >
        {!collapsed ? (
          <ArtifactContent />
        ) : (
          <div
            className="
              flex
              flex-col

              h-full
              w-full

              bg-[#0d0f14]
            "
          >
            <button
              onClick={() => setCollapsed(false)}
              className="
                flex
                items-center
                justify-center

                w-7
                h-7

                mx-auto
                mt-2

                rounded-lg

                text-slate-500

                hover:text-slate-200
                hover:bg-white/[0.05]

                cursor-pointer
              "
            >
              <PanelRightOpen size={15} />
            </button>

            <div
              className="
                flex-1

                flex
                items-center
                justify-center
              "
            >
              <h2
                className="
                  text-[10px]

                  font-medium

                  text-slate-600

                  tracking-widest

                  uppercase

                  whitespace-nowrap
                "
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                {artifact?.title}
              </h2>
            </div>
          </div>
        )}
      </motion.aside>

      {/* =================================================
          MOBILE ARTIFACT DRAWER

          IMPORTANT:
          NO EXTRA FLOATING BUTTON HERE.
          Button is handled by ChatInput.
      ================================================= */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* BACKDROP */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() => setMobileOpen?.(false)}
              className="
                lg:hidden

                fixed
                inset-0

                z-[140]

                bg-black/70

                backdrop-blur-sm
              "
            />

            {/* DRAWER */}

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 30,
                scale: 0.98,
              }}
              transition={{
                duration: 0.25,
                ease: easeInOut,
              }}
              className="
                lg:hidden

                fixed

                inset-2
                sm:inset-4

                z-[150]

                rounded-2xl

                overflow-hidden

                border
                border-white/[0.08]

                shadow-2xl

                bg-[#0d0f14]
              "
            >
              <ArtifactContent mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
