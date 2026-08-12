"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    router.push(`/workspace?url=${encodeURIComponent(videoUrl.trim())}`);
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col" style={{ backgroundColor: "rgb(0, 0, 0)" }}>
      <Header />
      
      <main className="flex flex-col items-center w-full px-gutter max-w-container-max mx-auto shrink-0">
        {/* Hero Section */}
        <section className="w-full text-center max-w-3xl flex flex-col gap-lg items-center justify-center min-h-[calc(100dvh-64px)]">
          <div className="flex flex-col gap-sm">
            <h1 className="text-5xl md:text-7xl font-bold text-on-surface leading-[1.1] tracking-tight">
              Give Your Content a<br/>New Life
            </h1>
            <p className="text-xl text-on-surface-variant mt-4">
              Transform YouTube videos into publish-ready, SEO-optimized blog posts in seconds.
            </p>
          </div>
          
          {/* Input Area */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl flex glow-focus transition-shadow">
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <div className="flex items-center gap-3 bg-surface px-5 py-3 border border-outline-variant focus-within:border-outline transition-colors flex-grow rounded-3xl">
                <span className="material-symbols-outlined text-on-surface-variant text-2xl">smart_display</span>
                <input 
                  className="bg-transparent border-none outline-none flex-grow text-on-surface placeholder:text-on-surface-variant focus:ring-0 p-0 text-base py-1" 
                  placeholder="Paste YouTube link" 
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="bg-inverse-primary text-inverse-on-surface font-label-sm px-8 py-4 hover:opacity-90 transition-opacity w-full md:w-max whitespace-nowrap rounded-3xl cursor-pointer font-semibold text-sm"
              >
                Try Now
              </button>
            </div>
          </form>
        </section>

      </main>

      {/* Feature Showcase Section — white background */}
      <section className="w-full bg-white py-24">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2" style={{ color: "#494bd6" }}>
                <span className="material-symbols-outlined text-base">favorite</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Delight your readers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Professional Quality<br/>Writing That Sounds<br/>Like <span style={{ color: "#494bd6" }}>You</span>
              </h2>
              <p className="text-gray-500 text-base mt-1">
                Generate articles that sound like you wrote them — not AI.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="p-2 rounded-full h-max flex items-center justify-center shrink-0" style={{ backgroundColor: "#f0f0ff" }}>
                  <span className="material-symbols-outlined" style={{ color: "#494bd6", fontSize: "20px" }}>edit_note</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-gray-900">Genuine, human-like writing</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Output that reads naturally, feels polished, and avoids the flat tone people expect from AI content.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="p-2 rounded-full h-max flex items-center justify-center shrink-0" style={{ backgroundColor: "#f0f0ff" }}>
                  <span className="material-symbols-outlined" style={{ color: "#494bd6", fontSize: "20px" }}>record_voice_over</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-gray-900">Matches your tone and voice</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Keep the personality, phrasing, and style that make your content feel unmistakably yours.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
                <div className="p-2 rounded-full h-max flex items-center justify-center shrink-0" style={{ backgroundColor: "#f0f0ff" }}>
                  <span className="material-symbols-outlined" style={{ color: "#494bd6", fontSize: "20px" }}>search</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-gray-900">SEO / GEO optimized</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Built to perform across search and discovery surfaces with clean structure, metadata, and readable formatting.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <button
                className="border text-gray-900 text-xs font-semibold px-6 py-3 rounded-full hover:border-indigo-500 transition-colors cursor-pointer"
                style={{ borderColor: "#d1d5db" }}
              >
                Learn more
              </button>
            </div>
          </div>

          {/* Right Column: Visual Preview */}
          <div className="relative flex justify-center items-center w-full">
            {/* Subtle glow */}
            <div className="absolute -inset-4 rounded-[32px] blur-2xl -z-10" style={{ background: "linear-gradient(135deg, rgba(73,75,214,0.08), rgba(128,131,255,0.08))" }} />

            <div className="rounded-3xl p-6 border shadow-xl w-full max-w-sm relative overflow-hidden" style={{ backgroundColor: "#f8f8ff", borderColor: "#e5e7eb" }}>
              {/* Mock Editor Header */}
              <div className="flex justify-between items-center mb-4 border-b pb-3" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ff5f56" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ffbd2e" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#27c93f" }} />
                </div>
                <div className="text-xs text-gray-400">ChatGPT Tutorial: How to Use ChatGPT for Beginners</div>
              </div>

              {/* Mock Content Lines */}
              <div className="flex flex-col gap-2">
                <div className="h-3 rounded w-3/4" style={{ backgroundColor: "#e5e7eb" }} />
                <div className="h-3 rounded w-full" style={{ backgroundColor: "#e5e7eb" }} />
                <div className="h-3 rounded w-5/6" style={{ backgroundColor: "#e5e7eb" }} />
                {/* Mock thumbnail */}
                <div className="h-28 rounded-xl w-full mt-2 flex items-center justify-center" style={{ backgroundColor: "#1f2937" }}>
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-base">play_arrow</span>
                  </div>
                </div>
                <div className="h-3 rounded w-full mt-1" style={{ backgroundColor: "#e5e7eb" }} />
                <div className="h-3 rounded w-2/3" style={{ backgroundColor: "#e5e7eb" }} />
                <div className="h-3 rounded w-4/5" style={{ backgroundColor: "#e5e7eb" }} />
                <div className="h-3 rounded w-full" style={{ backgroundColor: "#e5e7eb" }} />
              </div>

              {/* Floating Analytics Panel */}
              <div
                className="absolute -right-6 top-8 rounded-2xl p-4 shadow-2xl w-52 flex flex-col gap-3"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
              >
                {/* Gauge / Score */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="transparent" stroke="#f0f0ff" strokeWidth="7" />
                      <circle
                        cx="40" cy="40" r="32" fill="transparent"
                        stroke="url(#scoreGrad)" strokeWidth="7"
                        strokeDasharray="201" strokeDashoffset="40"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="60%" stopColor="#22c55e" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute text-lg font-bold text-gray-900">98%</span>
                  </div>
                  <span className="text-xs text-gray-500 text-center leading-tight">
                    Blog post score is <span className="font-bold" style={{ color: "#22c55e" }}>Excellent</span>
                  </span>
                </div>

                <div className="border-t pt-2" style={{ borderColor: "#f0f0ff" }}>
                  {/* Readability */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-medium text-gray-700">Readability ✓</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}>+10</span>
                    </div>
                    <p className="text-[9px] text-gray-400 leading-tight">6th–8th grade reading level</p>
                  </div>
                  {/* AI Detector */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-medium text-gray-700">AI Content Detector ✓</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}>+5</span>
                    </div>
                    <p className="text-[9px] text-gray-400 leading-tight">Not detected by AI content detectors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
