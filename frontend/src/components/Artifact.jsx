import { useState } from "react";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import { FiCode } from "react-icons/fi";
import { Check, Code2, Copy, Eye, PanelRightClose, PanelRightOpen } from "lucide-react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { detectLanguage } from './../../utils/detectLanguage.js';


export default function Artifact() {
   const [collapsed,setCollapsed]=useState(false);
   const [tab, setTab]               = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied]         = useState(false);
  const { artifacts } = useSelector(state => state.message);


  const artifact = artifacts?.[0];
  if (!artifact) return null;

  const file       = artifact?.files?.[activeFile];
  const htmlFile   = artifact?.files?.find(f => f.name === "index.html");
  const cssFile    = artifact?.files?.find(f => f.name === "style.css");
  const jsFile     = artifact?.files?.find(f => f.name === "script.js");

  const canPreview = Boolean(htmlFile);

  const previewDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>${cssFile?.content || ""}</style>
</head>
<body>
${htmlFile?.content || ""}
<script>${jsFile?.content || ""}</script>
</body>
</html>`;

  const handleCopy = async () => {
  await  navigator.clipboard.writeText(file?.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
    initial={{width:"450px"}}
    animate={{width:collapsed?40:450}}
    transition={{
      duration:0.4,
      ease:easeInOut
    }}
    className='hidden lg:flex h-full border-l border-white/6 flex-col overflow-hidden shrink-0' >
    {!collapsed ? <div className="flex flex-col h-full bg-[#0d0f14]">
      {/* Header */} 
      <div className="h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0">
        <button
        onClick={()=>setCollapsed(true)}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
        >
          <PanelRightClose size={16} />
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
            <FiCode className="text-indigo-400" size={10} />
          </div>
          <h2 className="text-[13px] font-medium text-slate-200 truncate">{artifact?.title}</h2>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {/* Copy button — only in code tab */}
          {tab === "code" && (
            <button
            onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer"
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              {copied ? "Copied" : ""}
            </button>
          )}

          {canPreview && (
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg">
              <button
                onClick={() => setTab("code")}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150
                  ${tab === "code" ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-200"}`}
              >
                <Code2 size={11} /> Code
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150
                  ${tab === "preview" ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-200"}`}
              >
                <Eye size={11} /> Preview
              </button>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {tab === "code" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="flex border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0"
          >
            {artifact?.files?.map((f, index) => (
              <button
                key={f?.name}
                onClick={() => setActiveFile(index)}
                className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/[0.05] relative cursor-pointer bg-transparent 
                  ${activeFile === index ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
              >
                {f?.name}
                {activeFile === index && (
                  <motion.div layoutId="filetab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Editor / Preview */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "preview" && canPreview ? (
            <motion.div 
            key="preview" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.15 }} 
            className="w-full h-full">
            <iframe title="preview" sandbox="allow-scripts" srcDoc={previewDoc} className="w-full h-full bg-white" />
            </motion.div>
          ) : (
            <motion.div 
            key={`code-${activeFile}`} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.15 }} 
            className="w-full h-full">
              <Editor
                theme="vs-dark"
                language={detectLanguage(file?.name || "")}
                value={file?.content || ""}
                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 11, wordWrap: "on", automaticLayout: true, scrollBeyondLastLine: false, padding: { top: 16 }, lineNumbers: "on", renderLineHighlight: "none" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div> 
    :
    <div className="flex flex-col h-full bg-[#0d0f14]">
    <button
        onClick={()=>setCollapsed(false)}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
        >
          <PanelRightOpen size={15} />
        </button>

        <div className="flex-1 flex items-center justify-center">
          <h2 className="text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >{artifact?.title}</h2>
        </div>
    </div> }
    
    </motion.div>
  );
}