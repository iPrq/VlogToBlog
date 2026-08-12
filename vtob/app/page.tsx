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
      
      <main className="flex-grow flex flex-col items-center w-full px-gutter max-w-container-max mx-auto mt-xl shrink-0">
        {/* Hero Section */}
        <section className="w-full text-center max-w-3xl flex flex-col gap-lg items-center py-32">
          <div className="flex flex-col gap-sm">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface leading-[1.15]">
              Give Your Content a<br className=""/>New Life
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-4">
              Transform YouTube videos into publish-ready, SEO-optimized blog posts in seconds.
            </p>
          </div>
          
          {/* Input Area */}
          <form onSubmit={handleSubmit} className="w-full max-w-xl flex glow-focus transition-shadow">
            <div className="flex flex-col md:flex-row items-center gap-sm w-full">
              <div className="flex items-center gap-sm bg-surface px-sm py-xs border border-outline-variant focus-within:border-outline transition-colors flex-grow rounded-3xl">
                <span className="material-symbols-outlined text-on-surface-variant">smart_display</span>
                <input 
                  className="bg-transparent border-none outline-none flex-grow text-on-surface font-body-md placeholder:text-on-surface-variant focus:ring-0 p-0 text-sm py-2" 
                  placeholder="Paste YouTube URL here..." 
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="bg-inverse-primary text-inverse-on-surface font-label-sm text-label-sm px-lg py-sm hover:opacity-90 transition-opacity w-full md:w-max whitespace-nowrap rounded-3xl cursor-pointer py-3 font-semibold"
              >
                Try Now
              </button>
            </div>
          </form>
        </section>

        {/* Feature Showcase (Bento Grid Style) */}
        <section className="max-w-5xl mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 gap-xl py-32 items-center w-full">
          {/* Left Column: Content */}
          <div className="flex flex-col gap-lg">
            <div className="flex flex-col gap-md">
              <div className="flex items-center gap-xs text-primary">
                <span className="material-symbols-outlined text-body-lg">favorite</span>
                <span className="font-label-sm uppercase tracking-wider font-semibold">Delight your readers</span>
              </div>
              <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface leading-tight">
                Professional Quality<br/>Writing That Sounds<br/>Like <span className="text-primary">You</span>
              </h2>
              <p className="font-body-lg text-on-surface-variant mt-2">
                Generate articles that sound like you wrote them — not AI.
              </p>
            </div>
            
            <div className="flex flex-col gap-lg mt-md">
              {/* Feature 1 */}
              <div className="flex gap-md">
                <div className="bg-surface-container-highest p-sm rounded-full h-max flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">edit_note</span>
                </div>
                <div className="flex flex-col gap-xs">
                  <h3 className="font-headline-md text-on-surface text-base font-bold">Genuine, human-like writing</h3>
                  <p className="font-body-md text-on-surface-variant text-xs mt-1 leading-relaxed">
                    Output that reads naturally, feels polished, and avoids the flat tone people expect from AI content.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="flex gap-md">
                <div className="bg-surface-container-highest p-sm rounded-full h-max flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">record_voice_over</span>
                </div>
                <div className="flex flex-col gap-xs">
                  <h3 className="font-headline-md text-on-surface text-base font-bold">Matches your tone and voice</h3>
                  <p className="font-body-md text-on-surface-variant text-xs mt-1 leading-relaxed">
                    Keep the personality, phrasing, and style that make your content feel unmistakably yours.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="flex gap-md">
                <div className="bg-surface-container-highest p-sm rounded-full h-max flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">search</span>
                </div>
                <div className="flex flex-col gap-xs">
                  <h3 className="font-headline-md text-on-surface text-base font-bold">SEO / GEO optimized</h3>
                  <p className="font-body-md text-on-surface-variant text-xs mt-1 leading-relaxed">
                    Built to perform across search and discovery surfaces with clean structure, metadata, and readable formatting.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-xl">
              <button className="border border-outline-variant text-on-surface font-label-sm px-lg py-sm rounded-full hover:border-primary transition-colors cursor-pointer font-semibold">
                Learn more
              </button>
            </div>
          </div>

          {/* Right Column: Visual Preview */}
          <div className="relative flex justify-center items-center w-full">
            {/* Outer glow accent */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-primary-container/10 rounded-[32px] blur-2xl -z-10" />
            
            <div className="bg-surface-container-low rounded-3xl p-lg border border-outline-variant shadow-lg w-full max-w-md relative overflow-hidden">
              {/* Mock Editor Header */}
              <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
                <div className="flex gap-xs">
                  <span className="w-2 h-2 rounded-full bg-error" />
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="text-label-sm text-on-surface-variant">ChatGPT Tutorial</div>
              </div>
              
              {/* Mock Content */}
              <div className="flex flex-col gap-sm opacity-40">
                <div className="h-4 bg-surface-container-highest rounded w-3/4" />
                <div className="h-4 bg-surface-container-highest rounded w-full" />
                <div className="h-4 bg-surface-container-highest rounded w-5/6" />
                <div className="h-32 bg-surface-container-highest rounded-xl w-full mt-sm" />
                <div className="h-4 bg-surface-container-highest rounded w-full" />
                <div className="h-4 bg-surface-container-highest rounded w-2/3" />
              </div>
              
              {/* Floating Analytics Panel */}
              <div className="absolute -right-4 top-1/4 bg-surface-container-highest border border-outline-variant rounded-3xl p-md shadow-2xl w-64 flex flex-col gap-md">
                <div className="flex flex-col items-center gap-xs">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-surface-container-low" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8" />
                      <circle className="text-primary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="50" strokeWidth="8" />
                    </svg>
                    <span className="absolute font-bold text-headline-md text-white">98%</span>
                  </div>
                  <span className="font-label-sm text-on-surface">
                    Blog post score is <span className="text-primary font-bold">Excellent</span>
                  </span>
                </div>
                
                <div className="flex flex-col gap-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-label-sm text-zinc-400">Readability</span>
                    <span className="bg-primary-container text-on-primary-container px-xs rounded text-[10px] font-bold">+10</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-label-sm text-zinc-400">AI Detector</span>
                    <span className="bg-primary-container text-on-primary-container px-xs rounded text-[10px] font-bold">+5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
