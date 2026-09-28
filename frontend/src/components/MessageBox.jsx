import { Check, Copy } from "lucide-react";

import React, { useEffect, useState } from "react";

import { FiExternalLink, FiX } from "react-icons/fi";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function MessageBox({
  role,
  content,
  images = [],
  isLoading = false,
}) {
  const isUser = role === "user";

  const [lightBox, setLightBox] = useState(null);

  const [copiedCode, setCopiedCode] = useState("");

  const [thinkingStage, setThinkingStage] = useState(0);

  const thinkingStages = [
    "Thinking",
    "Analyzing",
    "Retrieving",
    "Processing",
    "Generating",
  ];

  /* =====================================================
     THINKING STAGE ANIMATION
  ===================================================== */

  useEffect(() => {
    if (!isLoading) {
      setThinkingStage(0);
      return;
    }

    const interval = setInterval(() => {
      setThinkingStage(
        (previous) =>
          (previous + 1) % thinkingStages.length
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isLoading]);

  /* =====================================================
     COPY CODE
  ===================================================== */

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);

      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  /* =====================================================
     LOADING / THINKING MESSAGE

     ChatGPT-style:
     No large gray bubble.
  ===================================================== */

  if (isLoading) {
    return (
      <div className="flex justify-start w-full pt-2 pb-1">
        <div
          className="
            flex
            items-center
            gap-2

            text-slate-400

            px-0
            py-1
          "
        >
          {/* Animated dots */}

          <div className="flex items-center gap-1">
            <span
              className="
                w-1.5
                h-1.5
                rounded-full
                bg-slate-400
                animate-pulse
              "
            />

            <span
              className="
                w-1.5
                h-1.5
                rounded-full
                bg-slate-400
                animate-pulse
                [animation-delay:150ms]
              "
            />

            <span
              className="
                w-1.5
                h-1.5
                rounded-full
                bg-slate-400
                animate-pulse
                [animation-delay:300ms]
              "
            />
          </div>

          {/* Dynamic thinking text */}

          <span
            className="
              text-[12px]
              sm:text-[13px]

              text-slate-400

              min-w-[80px]

              transition-all
              duration-300
            "
          >
            {thinkingStages[thinkingStage]}

            <span className="inline-block w-5">
              ...
            </span>
          </span>
        </div>
      </div>
    );
  }

  /* =====================================================
     NORMAL MESSAGE
  ===================================================== */

  return (
    <>
      <div
        className={`
          flex
          w-full

          ${
            isUser
              ? "justify-end"
              : "justify-start"
          }

          pt-1
          pb-1
        `}
      >
        <div
          className={`
            break-words
            overflow-hidden
            leading-relaxed

            ${
              isUser
                ? `
                  w-fit

                  max-w-[92vw]
                  sm:max-w-[85%]
                  md:max-w-[72%]

                  px-3.5
                  sm:px-4

                  py-2.5

                  rounded-2xl
                  rounded-tr-sm

                  bg-[#2f2f2f]

                  text-slate-100
                `
                : `
                  w-full

                  max-w-[92vw]
                  sm:max-w-[85%]
                  md:max-w-[78%]

                  px-0
                  py-2

                  text-slate-200
                `
            }
          `}
        >
          {/* =================================================
              GENERATED IMAGES
          ================================================= */}

          {images.length > 0 && (
            <div
              className="
                flex
                flex-wrap
                gap-2

                mt-2
                sm:mt-3
              "
            >
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`generated-${index}`}
                  onClick={() =>
                    setLightBox(image)
                  }
                  onError={(event) =>
                    event.currentTarget.remove()
                  }
                  loading="lazy"
                  className="
                    w-28
                    h-20

                    sm:w-40
                    sm:h-28

                    rounded-xl

                    object-cover

                    border
                    border-white/10

                    cursor-zoom-in

                    hover:opacity-90

                    transition
                  "
                />
              ))}
            </div>
          )}

          {/* =================================================
              MARKDOWN
          ================================================= */}

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              /* =============================================
                 HEADINGS
              ============================================= */

              h1: ({ children }) => (
                <h1
                  className="
                    text-xl
                    sm:text-2xl

                    font-bold

                    mt-5
                    mb-3
                  "
                >
                  {children}
                </h1>
              ),

              h2: ({ children }) => (
                <h2
                  className="
                    text-lg
                    sm:text-xl

                    font-semibold

                    mt-4
                    mb-2
                  "
                >
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3
                  className="
                    text-base
                    sm:text-lg

                    font-semibold

                    mt-3
                    mb-2
                  "
                >
                  {children}
                </h3>
              ),

              /* =============================================
                 PARAGRAPH
              ============================================= */

              p: ({ children }) => (
                <p
                  className="
                    mb-3

                    whitespace-pre-wrap
                    break-words
                  "
                >
                  {children}
                </p>
              ),

              /* =============================================
                 UNORDERED LIST
              ============================================= */

              ul: ({ children }) => (
                <ul
                  className="
                    list-disc
                    pl-5

                    space-y-1

                    my-2
                  "
                >
                  {children}
                </ul>
              ),

              /* =============================================
                 ORDERED LIST
              ============================================= */

              ol: ({ children }) => (
                <ol
                  className="
                    list-decimal
                    pl-5

                    space-y-1

                    my-2
                  "
                >
                  {children}
                </ol>
              ),

              /* =============================================
                 TABLE
              ============================================= */

              table: ({ children }) => (
                <div
                  className="
                    overflow-x-auto
                    my-4
                  "
                >
                  <table
                    className="
                      min-w-full

                      border
                      border-white/10
                    "
                  >
                    {children}
                  </table>
                </div>
              ),

              th: ({ children }) => (
                <th
                  className="
                    border
                    border-white/10

                    bg-white/5

                    px-3
                    py-2

                    text-left
                  "
                >
                  {children}
                </th>
              ),

              td: ({ children }) => (
                <td
                  className="
                    border
                    border-white/10

                    px-3
                    py-2
                  "
                >
                  {children}
                </td>
              ),

              /* =============================================
                 LINKS
              ============================================= */

              a: ({
                href,
                children,
              }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    text-indigo-400

                    underline

                    inline-flex
                    items-center
                    gap-1
                  "
                >
                  {children}

                  <FiExternalLink
                    size={11}
                  />
                </a>
              ),

              /* =============================================
                 MARKDOWN IMAGES
              ============================================= */

              img: ({ src }) => {
                if (!src) return null;

                return (
                  <img
                    src={src}
                    alt="markdown"
                    loading="lazy"
                    onClick={() =>
                      setLightBox(src)
                    }
                    onError={(event) =>
                      event.currentTarget.remove()
                    }
                    className="
                      max-w-full

                      sm:w-40
                      sm:h-28

                      rounded-xl

                      object-cover

                      cursor-pointer
                    "
                  />
                );
              },

              /* =============================================
                 CODE
              ============================================= */

              code({
                className,
                children,
              }) {
                const value =
                  String(children)
                    .replace(
                      /^\s*```\w*\s*/,
                      ""
                    )
                    .replace(
                      /\s*```\s*$/,
                      ""
                    )
                    .trim();

                /* INLINE CODE */

                if (!className) {
                  return (
                    <code
                      className="
                        px-1.5
                        py-0.5

                        rounded

                        bg-white/10

                        text-violet-300

                        break-words
                      "
                    >
                      {value}
                    </code>
                  );
                }

                /* CODE BLOCK */

                const language =
                  className.replace(
                    "language-",
                    ""
                  );

                return (
                  <div
                    className="
                      my-4

                      max-w-full
                      overflow-hidden

                      rounded-xl

                      border
                      border-white/10

                      bg-[#111318]
                    "
                  >
                    {/* Code Header */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between

                        bg-[#1b1d24]

                        border-b
                        border-white/10

                        px-3
                        sm:px-4

                        py-2

                        gap-2
                      "
                    >
                      <span
                        className="
                          uppercase

                          text-[10px]
                          sm:text-xs

                          text-slate-400
                        "
                      >
                        {language}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          copyCode(value)
                        }
                        className="
                          flex
                          items-center
                          gap-1

                          text-[10px]
                          sm:text-xs

                          text-slate-400

                          cursor-pointer

                          hover:text-indigo-400

                          transition-colors
                        "
                      >
                        {copiedCode ===
                        value ? (
                          <>
                            <Check
                              size={14}
                            />

                            Copied
                          </>
                        ) : (
                          <>
                            <Copy
                              size={14}
                            />

                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    {/* Code */}

                    <div
                      className="
                        max-w-full
                        overflow-x-auto
                      "
                    >
                      <SyntaxHighlighter
                        language={language}
                        style={oneDark}
                        wrapLongLines
                        showLineNumbers
                        customStyle={{
                          margin: 0,
                          padding: "14px",
                          background:
                            "#0d1117",
                          fontSize: "12px",
                        }}
                      >
                        {value}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* =================================================
          IMAGE LIGHTBOX
      ================================================= */}

      {lightBox && (
        <div
          className="
            fixed
            inset-0
            z-50

            bg-black/80
            backdrop-blur-sm

            flex
            items-center
            justify-center

            p-4
            sm:p-6
          "
          onClick={() =>
            setLightBox(null)
          }
        >
          <button
            type="button"
            onClick={() =>
              setLightBox(null)
            }
            className="
              absolute

              top-4
              right-4

              sm:top-5
              sm:right-5

              text-white/80

              hover:text-white

              bg-white/10

              rounded-full

              p-2

              cursor-pointer
            "
          >
            <FiX size={18} />
          </button>

          <img
            src={lightBox}
            alt="preview"
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              max-w-[92vw]
              max-h-[85vh]

              rounded-2xl

              border
              border-white/10

              shadow-2xl

              object-contain
            "
          />
        </div>
      )}
    </>
  );
}

export default MessageBox;