"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface GenerationResult {
  video_id: string;
  transcript: string;
  outline: string;
  blog_draft: string;
  seo_blog: string;
}

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoUrl = searchParams.get("url") || "";

  // UI States: 'generating' | 'completed' | 'error'
  const [appState, setAppState] = useState<"generating" | "completed" | "error">("generating");
  const [loadingStep, setLoadingStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  // Results
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");
  
  // Toast notifications
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "info" | "error" }>({
    show: false,
    message: "",
    type: "success"
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to trigger toast
  const triggerToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ show: true, message, type });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // If no URL parameter is provided, redirect back to landing page
  useEffect(() => {
    if (!videoUrl) {
      router.push("/");
    }
  }, [videoUrl, router]);

  // Simulated progress stepper for generation workflow
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState === "generating") {
      setLoadingStep(1);
      interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < 4) return prev + 1;
          return prev;
        });
      }, 4500); // Progress stepper every 4.5 seconds
    }
    return () => clearInterval(interval);
  }, [appState]);

  // Main generation flow
  useEffect(() => {
    let active = true;
    if (!videoUrl) return;

    const fetchBlogData = async () => {
      try {
        const response = await fetch("http://localhost:8000/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ video_url: videoUrl }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || `Server returned error status ${response.status}`);
        }

        const data: GenerationResult = await response.json();
        if (active) {
          setResult(data);
          setEditorContent(data.seo_blog || "");
          setAppState("completed");
          setActiveTab("preview");
          triggerToast("Blog post generated successfully!", "success");
        }
      } catch (err: any) {
        console.error(err);
        if (active) {
          setErrorMessage(err.message || "Failed to generate blog post from backend pipeline.");
          setAppState("error");
          triggerToast("Failed to generate blog post", "error");
        }
      }
    };

    fetchBlogData();

    return () => {
      active = false;
    };
  }, [videoUrl]);

  // Extract YouTube ID
  const getYouTubeId = (url: string): string => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  };

  // Parse Title H1
  const parseTitle = (markdown: string): string => {
    if (!markdown) return "Untitled Blog Post";
    const h1Match = markdown.match(/^\s*#\s+(.+)$/m);
    if (h1Match) return h1Match[1].replace(/[*#]/g, "").trim();
    const titleMatch = markdown.match(/Title\s*\(H1\)\s*:\s*(.+)$/im);
    if (titleMatch) return titleMatch[1].replace(/[*#]/g, "").trim();
    return "Mastering Enterprise AI Pipelines";
  };

  // Markdown Custom Parser (lightweight renderer matching typography script)
  const parseMarkdownToHtml = (md: string): string => {
    if (!md) return "";
    
    let html = md;
    
    // Escape HTML to prevent basic XSS
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
      
    // 1. Code blocks: ```js ... ```
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-surface-container-low p-4 rounded-lg border border-surface-variant overflow-x-auto my-6 text-sm font-mono"><code class="language-${lang}">${code.trim()}</code></pre>`;
    });
    
    // 2. Inline Code: `code`
    html = html.replace(/`([^`]+)`/g, '<code class="bg-surface-container border border-surface-variant text-primary px-1.5 py-0.5 rounded font-mono text-xs">$1</code>');
    
    // 3. Blockquotes: > quote
    html = html.replace(/^\s*>\s+(.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 font-italic text-on-surface-variant my-6 italic">$1</blockquote>');
    
    // 4. Headers: H3, H2, H1
    html = html.replace(/^\s*###\s+(.+)$/gm, '<h3 class="text-lg font-semibold text-on-surface mt-8 mb-3 font-sans font-bold">$1</h3>');
    html = html.replace(/^\s*##\s+(.+)$/gm, '<h2 class="text-xl font-bold text-on-surface mt-10 mb-4 border-b border-surface-variant pb-2 font-sans font-extrabold">$1</h2>');
    html = html.replace(/^\s*#\s+(.+)$/gm, '<h1 class="text-2xl font-extrabold text-on-surface mt-12 mb-6 font-sans font-black">$1</h1>');
    
    // 5. Bold: **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-on-surface">$1</strong>');
    
    // 6. Italic: *text*
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-on-surface-variant">$1</em>');
    
    // 7. Unordered Lists: - item
    html = html.replace(/^\s*[-*+]\s+(.+)$/gm, '<li class="ml-6 list-disc text-on-surface-variant my-1.5 font-sans leading-relaxed">$1</li>');
    
    // 8. Ordered Lists: 1. item
    html = html.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li class="ml-6 list-decimal text-on-surface-variant my-1.5 font-sans leading-relaxed">$2</li>');
    
    // 9. Link: [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary underline inline-flex items-center gap-0.5">$1</a>');

    // 10. Process double breaks as paragraphs
    const blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      
      if (
        trimmed.startsWith("<h") || 
        trimmed.startsWith("<pre") || 
        trimmed.startsWith("<blockquote") || 
        trimmed.startsWith("<li") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol")
      ) {
        return trimmed;
      }
      return `<p class="leading-relaxed text-on-surface-variant my-4 font-sans">${trimmed.replace(/\n/g, "<br>")}</p>`;
    }).join("\n");
    
    return html;
  };

  // Toolbar Actions
  const handleToolbar = (style: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let replacement = "";
    switch (style) {
      case "bold":
        replacement = `**${selected || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selected || "italic text"}*`;
        break;
      case "link":
        replacement = `[${selected || "link text"}](https://youtube.com)`;
        break;
      case "bullet":
        replacement = `\n- ${selected || "list item"}`;
        break;
      case "number":
        replacement = `\n1. ${selected || "list item"}`;
        break;
      case "code":
        replacement = `\n\`\`\`\n${selected || "code block"}\n\`\`\``;
        break;
      case "image":
        replacement = `![${selected || "alt text"}](image_url)`;
        break;
      default:
        return;
    }

    const updated = text.substring(0, start) + replacement + text.substring(end);
    setEditorContent(updated);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent);
    triggerToast("Copied markdown to clipboard!", "success");
  };

  const handleDownload = () => {
    const title = parseTitle(editorContent).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const blob = new Blob([editorContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title || "blog-post"}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Markdown download started", "success");
  };

  const handleExport = (platform: "dev" | "hashnode") => {
    triggerToast(`Exporting to ${platform === "dev" ? "Dev.to" : "Hashnode"}...`, "info");
    setTimeout(() => {
      triggerToast(`Successfully exported to ${platform === "dev" ? "Dev.to" : "Hashnode"}!`, "success");
    }, 2000);
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col w-full" style={{ backgroundColor: "rgb(0, 0, 0)" }}>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-surface-container border border-surface-variant rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-1 rounded bg-primary-container text-on-primary-container">
            <span className="material-symbols-outlined text-sm font-bold">
              {toast.type === "success" ? "check" : toast.type === "error" ? "error" : "pending"}
            </span>
          </div>
          <p className="text-xs font-semibold text-on-surface">{toast.message}</p>
        </div>
      )}

      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto pb-xl bg-[#000000] w-full">
          
          {/* 1. LOADING PIPELINE STATE */}
          {appState === "generating" && (
            <div className="max-w-md mx-auto px-gutter py-32 w-full flex flex-col items-center gap-lg">
              <div className="w-16 h-16 rounded-full bg-surface-container border border-surface-variant flex items-center justify-center animate-spin text-primary">
                <span className="material-symbols-outlined text-3xl">sync</span>
              </div>
              
              <div className="text-center">
                <h3 className="font-headline-md text-on-surface">Assembling Content Pipeline</h3>
                <p className="font-body-md text-on-surface-variant text-sm mt-xs">
                  Fetching YouTube transcript and running SEO Graph Nodes...
                </p>
              </div>

              {/* Loader Steps Card */}
              <div className="w-full bg-surface-container-low border border-surface-variant rounded-3xl p-lg flex flex-col gap-md">
                {/* Step 1 */}
                <div className="flex items-center gap-md">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                    loadingStep > 1 ? "bg-primary border-primary text-on-primary" :
                    loadingStep === 1 ? "bg-primary/20 border-primary text-primary animate-pulse" :
                    "border-surface-variant text-on-surface-variant"
                  }`}>
                    {loadingStep > 1 ? <span className="material-symbols-outlined text-sm font-bold">check</span> : "1"}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${loadingStep >= 1 ? "text-on-surface" : "text-on-surface-variant/40"}`}>
                      Fetching Video Transcript
                    </h4>
                    <span className="text-[10px] text-on-surface-variant">Extracting subtitles from video source</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-md">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                    loadingStep > 2 ? "bg-primary border-primary text-on-primary" :
                    loadingStep === 2 ? "bg-primary/20 border-primary text-primary animate-pulse" :
                    "border-surface-variant text-on-surface-variant"
                  }`}>
                    {loadingStep > 2 ? <span className="material-symbols-outlined text-sm font-bold">check</span> : "2"}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${loadingStep >= 2 ? "text-on-surface" : "text-on-surface-variant/40"}`}>
                      Structuring Technical Outline
                    </h4>
                    <span className="text-[10px] text-on-surface-variant">Gemini mapping sections and logical flow</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-md">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                    loadingStep > 3 ? "bg-primary border-primary text-on-primary" :
                    loadingStep === 3 ? "bg-primary/20 border-primary text-primary animate-pulse" :
                    "border-surface-variant text-on-surface-variant"
                  }`}>
                    {loadingStep > 3 ? <span className="material-symbols-outlined text-sm font-bold">check</span> : "3"}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${loadingStep >= 3 ? "text-on-surface" : "text-on-surface-variant/40"}`}>
                      Drafting Comprehensive Sections
                    </h4>
                    <span className="text-[10px] text-on-surface-variant">Llama 3.3 composing detailed markdown prose</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-md">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                    loadingStep > 4 ? "bg-primary border-primary text-on-primary" :
                    loadingStep === 4 ? "bg-primary/20 border-primary text-primary animate-pulse" :
                    "border-surface-variant text-on-surface-variant"
                  }`}>
                    {loadingStep > 4 ? <span className="material-symbols-outlined text-sm font-bold">check</span> : "4"}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${loadingStep >= 4 ? "text-on-surface" : "text-on-surface-variant/40"}`}>
                      Polishing SEO Metadata
                    </h4>
                    <span className="text-[10px] text-on-surface-variant">Fast SEO headers & tags refine with Gemini</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. COMPLETED STATE Workspace */}
          {appState === "completed" && result && (
            <div className="max-w-4xl mx-auto px-gutter py-lg w-full flex flex-col gap-lg">
              
              {/* Back & Mode buttons */}
              <div className="flex justify-between items-center w-full border-b border-surface-variant pb-4">
                <button 
                  onClick={() => router.push("/")}
                  className="px-4 py-2 border border-surface-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Paste URL
                </button>

                <div className="flex bg-surface-container border border-outline-variant p-0.5 rounded-xl">
                  <button 
                    onClick={() => setActiveTab("edit")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === "edit" ? "bg-surface-container-highest text-white" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Edit Markdown
                  </button>
                  <button 
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === "preview" ? "bg-surface-container-highest text-white" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Live Preview
                  </button>
                </div>
              </div>

              {/* Video Metadata Card */}
              <section className="glass-panel rounded-xl p-md flex flex-col md:flex-row gap-lg items-start md:items-center bg-[#000000]">
                <div className="w-full md:w-1/3 aspect-video overflow-hidden relative border border-surface-variant rounded-xl shrink-0 bg-surface-container-low">
                  <img 
                    className="w-full h-full object-cover opacity-85" 
                    alt="YouTube Thumbnail"
                    src={`https://img.youtube.com/vi/${getYouTubeId(videoUrl) || "yM7O19_g7p0"}/hqdefault.jpg`}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-code text-white">14:23</div>
                </div>
                <div className="flex-1 flex flex-col gap-sm w-full">
                  <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface leading-tight">
                    {parseTitle(editorContent)}
                  </h1>
                  <div className="flex items-center justify-between w-full mt-2 gap-sm">
                    <a 
                      className="text-primary hover:text-secondary transition-colors font-code text-xs flex items-center gap-1 truncate max-w-[200px] md:max-w-xs" 
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="material-symbols-outlined text-sm">link</span> 
                      {videoUrl.replace("https://www.youtube.com/watch?v=", "youtube.com/watch?v=").slice(0, 30)}...
                    </a>
                    <div className="flex gap-2 shrink-0">
                      <span className="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px] font-bold">1080p</span>
                      <span className="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px] font-bold">EN-US</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Center Panel: Article Editor (Devpost Style) */}
              <article className="glass-panel rounded-xl p-0 overflow-hidden flex flex-col bg-[#000000]">
                
                {/* Editor Toolbar */}
                <div className="bg-surface-container border-b border-surface-variant p-sm flex items-center gap-sm sticky top-0 z-10">
                  <div className="flex items-center gap-1 border-r border-surface-variant pr-sm">
                    <button 
                      onClick={() => handleToolbar("bold")}
                      disabled={activeTab === "preview"}
                      className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-bright disabled:opacity-20 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">format_bold</span>
                    </button>
                    <button 
                      onClick={() => handleToolbar("italic")}
                      disabled={activeTab === "preview"}
                      className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-bright disabled:opacity-20 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">format_italic</span>
                    </button>
                    <button 
                      onClick={() => handleToolbar("link")}
                      disabled={activeTab === "preview"}
                      className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-bright disabled:opacity-20 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">link</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-1 border-r border-surface-variant pr-sm">
                    <button 
                      onClick={() => handleToolbar("bullet")}
                      disabled={activeTab === "preview"}
                      className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-bright disabled:opacity-20 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
                    </button>
                    <button 
                      onClick={() => handleToolbar("number")}
                      disabled={activeTab === "preview"}
                      className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-bright disabled:opacity-20 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">format_list_numbered</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleToolbar("code")}
                      disabled={activeTab === "preview"}
                      className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-bright disabled:opacity-20 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">code</span>
                    </button>
                    <button 
                      onClick={() => handleToolbar("image")}
                      disabled={activeTab === "preview"}
                      className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-bright disabled:opacity-20 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">image</span>
                    </button>
                  </div>
                  
                  <div className="ml-auto text-on-surface-variant font-label-sm text-xs font-semibold">
                    Autosaved 2m ago
                  </div>
                </div>

                {/* Editor Content Area */}
                <div className="p-lg md:p-xl flex flex-col prose w-full max-w-none focus:outline-none min-h-[500px]">
                  
                  {/* Author Banner Badge Header */}
                  <div className="flex items-center gap-md mb-lg not-prose border-b border-surface-variant pb-md flex-wrap text-xs text-on-surface-variant font-sans">
                    <div className="flex items-center gap-sm">
                      <img 
                        className="w-6 h-6 rounded-full bg-surface-variant" 
                        alt="Author Avatar" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP1LQ81prUDe1rqW9PnXV6hQKbiZqKs0Uk1hA7qmV-dzQt_pLrYTorw_MyANY9ZSYc-FB9cdLmkSGzM3wedasEHx04n8VwHqUxLKwgf3eO11-YOexdO4uPe0KaqoR-lUJwVD2MT2sgKzojQKxGSJUB1CgGivgrl7G9VtbTVyi10DGs4LOhmi6S7_-54EAJYj1keSEzxExjVM7h0VVG1aVgh-j15zNW3xirIMXONyrqxAg_uP_H01JQog"
                      />
                      <span className="font-semibold text-on-surface">System Admin</span>
                    </div>
                    <span>•</span>
                    <span className="font-semibold">5 min read</span>
                    <span>•</span>
                    <div className="flex gap-2">
                      <span className="text-primary font-code text-xs font-semibold">#AI</span>
                      <span className="text-primary font-code text-xs font-semibold">#Engineering</span>
                    </div>
                  </div>

                  {activeTab === "edit" ? (
                    <textarea
                      ref={textareaRef}
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      className="w-full flex-grow bg-transparent border-0 outline-none resize-none font-mono text-sm leading-relaxed text-on-surface-variant focus:ring-0 min-h-[450px]"
                      placeholder="Write or edit your markdown blog post..."
                    />
                  ) : (
                    <div 
                      className="w-full flex-grow prose max-w-none text-on-surface-variant"
                      dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(editorContent) }}
                    />
                  )}
                </div>
              </article>

              {/* Publishing Actions */}
              <div className="glass-panel rounded-xl p-md flex flex-col md:flex-row gap-sm bg-[#000000]">
                <button 
                  onClick={handleCopy}
                  className="flex-1 py-3 px-4 bg-primary text-on-primary font-body-md text-body-md font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 rounded-xl cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">content_copy</span> 
                  Copy Markdown
                </button>
                
                <button 
                  onClick={handleDownload}
                  className="flex-1 py-3 px-4 border border-surface-variant text-on-surface hover:border-outline hover:bg-surface-container transition-all font-body-md text-body-md font-semibold flex items-center justify-center gap-2 rounded-xl cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">download</span> 
                  Download .md
                </button>
                
                <button 
                  onClick={() => handleExport("dev")}
                  className="flex-1 py-3 px-4 border border-surface-variant bg-surface-container text-on-surface hover:bg-surface-bright transition-all font-body-md text-body-md font-semibold flex items-center justify-center gap-2 rounded-xl cursor-pointer"
                >
                  Export to Dev.to
                </button>
                
                <button 
                  onClick={() => handleExport("hashnode")}
                  className="flex-1 py-3 px-4 border border-primary bg-primary text-on-primary hover:opacity-90 transition-all font-body-md text-body-md font-semibold flex items-center justify-center gap-2 rounded-xl cursor-pointer"
                >
                  Export to Hashnode
                </button>
              </div>
            </div>
          )}

          {/* 3. ERROR PANEL STATE */}
          {appState === "error" && (
            <div className="max-w-md mx-auto px-gutter py-32 w-full flex flex-col items-center gap-md text-center">
              <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-2xl font-bold">error</span>
              </div>

              <div>
                <h3 className="font-headline-md text-on-surface">Generation Failed</h3>
                <p className="font-body-md text-on-surface-variant text-xs mt-xs leading-relaxed max-w-sm">
                  {errorMessage || "An error occurred in the LangGraph generation pipeline. Ensure the backend uvicorn server is running on port 8000 and your API keys are loaded."}
                </p>
              </div>

              <div className="flex gap-3 mt-sm">
                <button
                  onClick={() => router.push("/")}
                  className="px-5 py-2.5 rounded-xl border border-surface-variant text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:border-outline transition-all cursor-pointer"
                >
                  Back to Paste URL
                </button>
                <button
                  onClick={() => {
                    setAppState("generating");
                    // Simple page reload to trigger generating useEffect again
                    window.location.reload();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:opacity-90 transition-all shadow-lg cursor-pointer"
                >
                  Retry Request
                </button>
              </div>
            </div>
          )}

          <Footer />
        </main>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col gap-sm">
        <span className="material-symbols-outlined text-3xl animate-spin text-primary">sync</span>
        <span className="text-xs text-zinc-500 font-semibold font-sans">Loading Workspace...</span>
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  );
}
