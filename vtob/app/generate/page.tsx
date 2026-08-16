"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Code,
  Image as ImageIcon,
  Copy,
  Download,
  Check,
  Sparkles,
  ArrowLeft,
  Share2,
} from "lucide-react";

interface GenerationResponse {
  video_id: string;
  transcript: string;
  outline: string;
  blog_draft: string;
  seo_blog: string;
}

function GenerateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoUrl = searchParams.get("url") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GenerationResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);

  // Extract YouTube Video ID for thumbnail preview
  const videoId = extractVideoId(videoUrl);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  useEffect(() => {
    if (!videoUrl) return;

    const timer1 = setTimeout(() => setStep(2), 2500);
    const timer2 = setTimeout(() => setStep(3), 6000);
    const timer3 = setTimeout(() => setStep(4), 10000);

    async function fetchBlog() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://127.0.0.1:8000/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ video_url: videoUrl }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail || `Server error (${response.status})`
          );
        }

        const result: GenerationResponse = await response.json();
        setData(result);
      } catch (err: any) {
        console.error("Error generating blog post:", err);
        setError(
          err.message ||
            "Failed to connect to backend server. Make sure FastAPI server is running."
        );
      } finally {
        setLoading(false);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      }
    }

    fetchBlog();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [videoUrl]);

  const rawMarkdown = data?.seo_blog || "";
  const formattedMarkdown = formatMarkdownText(rawMarkdown);
  const blogTitle = extractTitle(formattedMarkdown) || "Mastering Enterprise AI Pipelines";
  const readingTime = calculateReadingTime(formattedMarkdown);

  const handleCopyMarkdown = () => {
    if (!formattedMarkdown) return;
    navigator.clipboard.writeText(formattedMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadMd = () => {
    if (!formattedMarkdown) return;
    const blob = new Blob([formattedMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${blogTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-black text-[#e2e2e2] min-h-screen flex flex-col font-sans">
      {/* ── Top Header Navigation ───────────────────────────────────────── */}
      <header className="flex justify-between items-center h-20 w-full px-8 max-w-6xl mx-auto border-b border-[#222222]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs text-[#c7c4d7] hover:text-white transition-colors mr-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xl font-bold text-white tracking-tight">
            VtoB
          </span>
        </div>
        <div>
          <button className="text-xs font-medium tracking-wider border border-[#464554] text-[#e2e2e2] hover:text-[#c0c1ff] hover:border-[#c0c1ff] transition-colors px-6 py-2.5 rounded-full bg-transparent cursor-pointer">
            Sign In
          </button>
        </div>
      </header>

      {/* ── Main Content Container ──────────────────────────────────────── */}
      <main className="flex-grow flex flex-col items-center w-full px-6 max-w-4xl mx-auto pt-8 pb-16 gap-8">
        {/* ── Video Metadata & Title Header ───────────────────────────── */}
        <div className="w-full grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-center">
          {/* Video Thumbnail */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#333333] bg-[#1a1a1a] shadow-xl">
            <img
              src={thumbnailUrl}
              alt="Video Thumbnail"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";
              }}
            />
            <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded backdrop-blur-sm">
              14:23
            </div>
          </div>

          {/* Title and Badge Info */}
          <div className="flex flex-col justify-between h-full gap-4">
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight tracking-tight">
              {blogTitle}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
              <a
                href={videoUrl || "https://youtube.com"}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#8083ff] hover:underline flex items-center gap-1.5 font-mono truncate max-w-xs"
              >
                <span>🔗 youtube.com/watch?v=...</span>
              </a>

              <div className="flex items-center gap-2">
                <span className="bg-[#1f1f1f] text-[#c7c4d7] text-[11px] px-3 py-1 rounded-md font-mono border border-[#333333]">
                  1080p
                </span>
                <span className="bg-[#1f1f1f] text-[#c7c4d7] text-[11px] px-3 py-1 rounded-md font-mono border border-[#333333]">
                  EN-US
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Editor Toolbar Floating Bar ─────────────────────────────── */}
        <div className="w-full bg-[#1e1e1e] border border-[#333333] rounded-2xl px-6 py-4 flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-5 text-[#c7c4d7]">
            <button className="hover:text-white transition-colors cursor-pointer" title="Bold">
              <Bold className="w-4 h-4" />
            </button>
            <button className="hover:text-white transition-colors cursor-pointer" title="Italic">
              <Italic className="w-4 h-4" />
            </button>
            <button className="hover:text-white transition-colors cursor-pointer" title="Insert Link">
              <LinkIcon className="w-4 h-4" />
            </button>
            <span className="h-4 w-px bg-[#333333]"></span>
            <button className="hover:text-white transition-colors cursor-pointer" title="Bullet List">
              <List className="w-4 h-4" />
            </button>
            <button className="hover:text-white transition-colors cursor-pointer" title="Numbered List">
              <ListOrdered className="w-4 h-4" />
            </button>
            <span className="h-4 w-px bg-[#333333]"></span>
            <button className="hover:text-white transition-colors cursor-pointer" title="Code Block">
              <Code className="w-4 h-4" />
            </button>
            <button className="hover:text-white transition-colors cursor-pointer" title="Insert Image">
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-[#888888] font-mono">
            {loading ? "Generating..." : "Autosaved 2m ago"}
          </div>
        </div>

        {/* ── Article Author & Meta Bar ───────────────────────────────── */}
        <div className="w-full flex items-center gap-3 text-xs text-[#c7c4d7] pt-2 pb-5 border-b border-[#2a2a2a]">
          <div className="w-6 h-6 rounded-full bg-[#353535] flex items-center justify-center text-[10px] font-bold text-white">
            SA
          </div>
          <span className="font-semibold text-white">System Admin</span>
          <span>•</span>
          <span>{readingTime} min read</span>
          <span>•</span>
          <span className="text-[#c0c1ff] font-mono">#AI #Engineering</span>
        </div>

        {/* ── Main Article Body Content ────────────────────────────────── */}
        <div className="w-full min-h-[350px]">
          {loading ? (
            /* Loading State */
            <div className="w-full flex flex-col items-center justify-center py-20 gap-6">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#c0c1ff] animate-pulse" />
                <div className="absolute inset-0 border-4 border-[#333333] border-t-[#c0c1ff] rounded-full animate-spin"></div>
              </div>

              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-lg font-semibold text-white">
                  Generating Your SEO Blog Post...
                </h3>
                <p className="text-xs text-[#c7c4d7] max-w-sm">
                  {step === 1 && "Step 1/4: Fetching YouTube Transcript..."}
                  {step === 2 && "Step 2/4: Extracting Technical Outline (Gemini 3.1)..."}
                  {step === 3 && "Step 3/4: Drafting Publication Prose (Llama 3.3 70B)..."}
                  {step === 4 && "Step 4/4: Polishing Metadata & Formatting..."}
                </p>
              </div>

              <div className="w-64 h-1.5 bg-[#222222] rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#8083ff] transition-all duration-500 rounded-full"
                  style={{ width: `${step * 25}%` }}
                ></div>
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="w-full bg-[#93000a]/20 border border-[#ffb4ab]/30 rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-lg font-semibold text-[#ffb4ab]">
                Failed to Generate Blog Post
              </h3>
              <p className="text-sm text-[#c7c4d7] max-w-md">{error}</p>
              <button
                onClick={() => router.push("/")}
                className="mt-2 text-xs bg-[#353535] text-white px-6 py-2.5 rounded-full hover:bg-[#464554] transition-colors cursor-pointer"
              >
                Try Another URL
              </button>
            </div>
          ) : (
            /* Styled Markdown Viewer */
            <article className="w-full text-[#c7c4d7] space-y-4">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-8 mb-6 leading-tight">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-white tracking-tight mt-10 mb-4 pb-2 border-b border-[#2a2a2a] flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-[#8083ff] rounded-full inline-block shrink-0"></span>
                      <span>{children}</span>
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-[#c0c1ff] mt-8 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-base text-[#c7c4d7] leading-relaxed my-4">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-6 bg-[#161622] border-l-4 border-[#8083ff] rounded-r-2xl p-5 text-[#e2e2e2] shadow-lg">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-4 space-y-2.5 list-disc list-inside text-[#c7c4d7] pl-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-4 space-y-2.5 list-decimal list-inside text-[#c7c4d7] pl-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed text-[#c7c4d7]">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">
                      {children}
                    </strong>
                  ),
                  code: ({ children }) => (
                    <code className="bg-[#1e1e2d] text-[#c0c1ff] font-mono text-xs px-2 py-1 rounded border border-[#353545]">
                      {children}
                    </code>
                  ),
                  hr: () => <hr className="border-t border-[#2a2a2a] my-8" />,
                }}
              >
                {formattedMarkdown}
              </ReactMarkdown>
            </article>
          )}
        </div>

        {/* ── Bottom Action Buttons Bar ───────────────────────────────── */}
        <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-center gap-4 pt-6">
          {/* Copy Markdown Button */}
          <button
            onClick={handleCopyMarkdown}
            disabled={loading || !data}
            className="flex-1 min-w-[150px] bg-[#c0c1ff] text-[#1000a9] hover:bg-[#b0b1ff] text-xs font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Markdown
              </>
            )}
          </button>

          {/* Download .md Button */}
          <button
            onClick={handleDownloadMd}
            disabled={loading || !data}
            className="flex-1 min-w-[150px] bg-black text-white hover:bg-[#151515] border border-[#353535] text-xs font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg"
          >
            <Download className="w-4 h-4" /> Download .md
          </button>

          {/* Export to Dev.to */}
          <button
            disabled={loading || !data}
            className="flex-1 min-w-[150px] bg-[#1f1f1f] text-[#c7c4d7] hover:text-white hover:bg-[#2a2a2a] text-xs font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer border border-[#333333]"
          >
            <Share2 className="w-4 h-4" /> Export to Dev.to
          </button>

          {/* Export to Hashnode */}
          <button
            disabled={loading || !data}
            className="flex-1 min-w-[150px] bg-[#c0c1ff] text-[#1000a9] hover:bg-[#b0b1ff] text-xs font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg"
          >
            <Share2 className="w-4 h-4" /> Export to Hashnode
          </button>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#0e0e0e] text-[#c7c4d7] border-t border-[#333333] w-full py-8 px-8 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto gap-4 text-xs">
          <div className="text-xl font-semibold text-white">VtoB</div>
          <div>© 2024 VtoB. Professional Content Repurposing.</div>
          <div className="flex gap-6">
            <a className="hover:text-[#c0c1ff] transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-[#c0c1ff] transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-[#c0c1ff] transition-colors" href="#">
              API Docs
            </a>
            <a className="hover:text-[#c0c1ff] transition-colors" href="#">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Helper Utilities ───────────────────────────────────────────────────

function extractVideoId(url: string): string {
  if (!url) return "dQw4w9WgXcQ";
  try {
    if (url.includes("v=")) {
      return url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split("?")[0];
    }
    return url;
  } catch {
    return "dQw4w9WgXcQ";
  }
}

function extractTitle(markdown?: string): string | null {
  if (!markdown) return null;
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function calculateReadingTime(markdown?: string): number {
  if (!markdown) return 5;
  const words = markdown.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatMarkdownText(rawText: string): string {
  if (!rawText) return "";

  let formatted = rawText;

  // Ensure main title has #
  const lines = formatted.split("\n");
  if (lines.length > 0 && !lines[0].startsWith("#")) {
    lines[0] = `# ${lines[0].replace(/^#+\s*/, "")}`;
  }
  formatted = lines.join("\n");

  // Format Meta Description: line into a blockquote if not already
  formatted = formatted.replace(
    /^(Meta Description:.*$)/gim,
    "> **$1**"
  );

  // Format Key Takeaways header if missing ##
  formatted = formatted.replace(
    /^(Key Takeaways\s*$)/gim,
    "## Key Takeaways"
  );

  return formatted;
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-black text-white min-h-screen flex items-center justify-center font-sans">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Loading Article Workspace...</span>
          </div>
        </div>
      }
    >
      <GenerateContent />
    </Suspense>
  );
}
