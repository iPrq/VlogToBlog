"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StrokeText from "../components/StrokeText";
import LightRays from "../components/LightRays";
import BlurText from "../components/BlurText";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleTryNow = () => {
    if (!url.trim()) return;
    router.push(`/generate?url=${encodeURIComponent(url.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTryNow();
    }
  };

  return (
    <div className="bg-black text-[#e2e2e2] min-h-screen flex flex-col font-sans">
      {/* ── Full Screen Hero Wrapper (Hero Gradient + Light Rays Background) ── */}
      <div className="min-h-screen flex flex-col w-full hero-animated-bg relative overflow-hidden">
        {/* Light Rays Effect strictly bound to Hero Section */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#8083ff"
            raysSpeed={1.2}
            lightSpread={0.85}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.12}
            noiseAmount={0.04}
            distortion={0.05}
          />
        </div>

        <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto px-6 relative z-10">
          {/* ── Top App Bar ─────────────────────────────────────────────── */}
          <header className="flex justify-between items-center h-20 w-full shrink-0 bg-transparent">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-white tracking-tight">
                VtoB
              </span>
            </div>
            <div>
              <button className="text-xs font-medium tracking-wider border border-[#464554] text-[#e2e2e2] hover:text-[#c0c1ff] hover:border-[#c0c1ff] transition-colors duration-200 px-5 py-2 rounded-full bg-transparent cursor-pointer">
                Sign In
              </button>
            </div>
          </header>

          {/* ── Hero Section (Vertically Centered) ───────────────────────── */}
          <section className="flex-1 flex flex-col justify-center items-center text-center py-12 max-w-3xl mx-auto w-full">
            <div className="flex flex-col gap-4 items-center w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight flex flex-col items-center w-full leading-none">
                <BlurText
                  text="Give Your Content a"
                  delay={120}
                  animateBy="words"
                  direction="top"
                  className="justify-center text-white"
                />
                <span className="w-full max-w-xs sm:max-w-sm md:max-w-md -mt-2 inline-block">
                  <StrokeText
                    text="New Life"
                    strokeColor="#818CF8"
                    fillColor="#A78BFA"
                    strokeWidth={1.4}
                    drawDuration={1.6}
                    fillDelay={0.2}
                    stagger={0.05}
                    ease="power2.out"
                    trigger="mount"
                    fillMode="wipe"
                    fontSize={68}
                    fontWeight={800}
                    letterSpacing={-2}
                  />
                </span>
              </h1>
              <p className="text-base md:text-xl text-[#c7c4d7] max-w-xl mx-auto leading-relaxed mt-2">
                Transform YouTube videos into publish-ready, SEO-optimized blog posts in seconds.
              </p>
            </div>

            {/* Input Area */}
            <div className="w-full max-w-xl mt-10 flex flex-col items-center gap-5">
              {/* Transparent Glass Input Box */}
              <div className="flex items-center gap-3 bg-transparent backdrop-blur-md px-6 py-4 border border-white/20 focus-within:border-[#c0c1ff] transition-all duration-300 rounded-full w-full shadow-2xl">
                <span className="material-symbols-outlined text-[#c7c4d7] text-2xl select-none">
                  smart_display
                </span>
                <input
                  className="bg-transparent border-none outline-none flex-grow text-white text-base md:text-lg placeholder-[#c7c4d7]/70 focus:ring-0 p-0"
                  placeholder="Paste YouTube URL here..."
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {/* Try Now Button Below with Hover Scale Effect */}
              <button
                onClick={handleTryNow}
                className="bg-[#494bd6] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase px-10 py-4 hover:bg-[#5b5df0] transition-all duration-300 transform hover:scale-110 active:scale-95 rounded-full cursor-pointer shadow-xl hover:shadow-[0_0_25px_rgba(128,131,255,0.4)]"
              >
                Try Now
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* ── Main Content for Feature Showcase & Below (Pure Black Background) ── */}
      <main className="flex-grow flex flex-col items-center w-full px-6 max-w-6xl mx-auto bg-black">
        {/* Feature Showcase Section */}
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 py-20 md:py-32 items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#c0c1ff]">
                <span className="material-symbols-outlined text-base select-none">
                  favorite
                </span>
                <span className="text-xs font-medium uppercase tracking-widest">
                  Delight your readers
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                Professional Quality<br />
                Writing That Sounds<br />
                Like <span className="text-[#c0c1ff]">You</span>
              </h2>
              <p className="text-base text-[#c7c4d7]">
                Generate articles that sound like you wrote them — not AI.
              </p>
            </div>

            {/* Feature items */}
            <div className="flex flex-col gap-6 mt-2">
              {/* Feature 1 */}
              <div className="flex gap-4 items-start">
                <div className="bg-[#353535] p-3 rounded-full h-max flex-shrink-0">
                  <span className="material-symbols-outlined text-[#c0c1ff] text-xl block select-none">
                    edit_note
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-white">
                    Genuine, human-like writing
                  </h3>
                  <p className="text-sm text-[#c7c4d7] leading-relaxed">
                    Output that reads naturally, feels polished, and avoids the flat tone people expect from AI content.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4 items-start">
                <div className="bg-[#353535] p-3 rounded-full h-max flex-shrink-0">
                  <span className="material-symbols-outlined text-[#c0c1ff] text-xl block select-none">
                    record_voice_over
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-white">
                    Matches your tone and voice
                  </h3>
                  <p className="text-sm text-[#c7c4d7] leading-relaxed">
                    Keep the personality, phrasing, and style that make your content feel unmistakably yours.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4 items-start">
                <div className="bg-[#353535] p-3 rounded-full h-max flex-shrink-0">
                  <span className="material-symbols-outlined text-[#c0c1ff] text-xl block select-none">
                    search
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-white">
                    SEO / GEO optimized
                  </h3>
                  <p className="text-sm text-[#c7c4d7] leading-relaxed">
                    Built to perform across search and discovery surfaces with clean structure, metadata, and readable formatting.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button className="border border-[#464554] text-white text-xs font-medium tracking-wider px-7 py-3 rounded-full hover:border-[#c0c1ff] hover:text-[#c0c1ff] transition-colors cursor-pointer">
                Learn more
              </button>
            </div>
          </div>

          {/* Right Column: Visual Preview Image */}
          <div className="relative flex justify-center items-center py-6">
            <div className="bg-[#1b1b1b] rounded-3xl p-2 border border-[#464554] shadow-2xl w-full max-w-sm relative">
              <img
                src="/quality.png"
                alt="Quality Preview"
                className="w-full h-auto object-cover rounded-2xl"
              />

              {/* Floating Analytics Panel */}
              <div className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 bg-[#353535] border border-[#464554] rounded-3xl p-5 shadow-2xl w-56 sm:w-64 flex flex-col gap-4 z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        className="text-[#1b1b1b]"
                        cx="40"
                        cy="40"
                        fill="transparent"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="6"
                      ></circle>
                      <circle
                        className="text-[#c0c1ff]"
                        cx="40"
                        cy="40"
                        fill="transparent"
                        r="32"
                        stroke="currentColor"
                        strokeDasharray="201"
                        strokeDashoffset="40"
                        strokeWidth="6"
                        strokeLinecap="round"
                      ></circle>
                    </svg>
                    <span className="absolute font-bold text-lg text-white">
                      98%
                    </span>
                  </div>
                  <span className="text-xs text-[#e2e2e2] text-center">
                    Blog post score is{" "}
                    <span className="text-[#c0c1ff] font-semibold">Excellent</span>
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#c7c4d7]">Readability</span>
                    <span className="bg-[#8083ff] text-[#0d0096] px-2 py-0.5 rounded text-[10px] font-bold">
                      +10
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#c7c4d7]">AI Detector</span>
                    <span className="bg-[#8083ff] text-[#0d0096] px-2 py-0.5 rounded text-[10px] font-bold">
                      +5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#0e0e0e] text-[#c7c4d7] border-t border-[#464554] w-full py-8 px-6 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto gap-4 text-xs">
          <div className="text-xl font-semibold text-white">
            VtoB
          </div>
          <div>
            © 2024 VtoB. Professional Content Repurposing.
          </div>
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
