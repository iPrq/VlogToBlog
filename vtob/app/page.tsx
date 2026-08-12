"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlurText from "@/components/BlurText";
import StrokeText from "@/components/StrokeText";
import FoldText from "@/components/FoldText";

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
          <div className="flex flex-col gap-2 items-center">
            {/* Line 1 — BlurText blur-in animation */}
            <BlurText
              text="Give Your Content a"
              delay={120}
              animateBy="words"
              direction="top"
              stepDuration={0.5}
              className="text-5xl md:text-7xl font-bold text-on-surface leading-[1.15] tracking-tight justify-center"
            />
            {/* Line 2 — StrokeText draw animation with vivid accent color */}
            <StrokeText
              text="New Life"
              strokeColor="#8083ff"
              fillColor="#c0c1ff"
              strokeWidth={1.2}
              drawDuration={1.8}
              fillDelay={0.15}
              stagger={0.06}
              fillMode="wipe"
              trigger="mount"
              fontSize={80}
              fontWeight={800}
              letterSpacing={-3}
              className="w-full max-w-2xl"
            />
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

      {/* Video Section */}
      <section className="w-full bg-black flex justify-center items-center py-10 px-6">
        <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto block"
          >
            <source src="/landing-page-hero-feature-podcast-web-812-crf26.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

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
              <h2 className="leading-none" aria-label="Professional Quality Writing That Sounds Like You">
                <FoldText
                  text="Professional Quality"
                  splitBy="char"
                  hinge="top"
                  trigger="scroll"
                  duration={0.55}
                  stagger={0.03}
                  ease="power3.out"
                  perspective={600}
                  creaseShading={0.45}
                  fontSize="clamp(1.6rem, 4vw, 2.8rem)"
                  fontWeight={800}
                  color="#111827"
                  style={{ lineHeight: 1.15 }}
                />
                <FoldText
                  text="Writing That Sounds"
                  splitBy="char"
                  hinge="top"
                  trigger="scroll"
                  duration={0.55}
                  stagger={0.028}
                  ease="power3.out"
                  perspective={600}
                  creaseShading={0.45}
                  fontSize="clamp(1.6rem, 4vw, 2.8rem)"
                  fontWeight={800}
                  color="#111827"
                  style={{ lineHeight: 1.15 }}
                />
                <FoldText
                  text="Like You"
                  splitBy="char"
                  hinge="top"
                  trigger="scroll"
                  duration={0.6}
                  stagger={0.05}
                  ease="power3.out"
                  perspective={600}
                  creaseShading={0.5}
                  fontSize="clamp(1.6rem, 4vw, 2.8rem)"
                  fontWeight={800}
                  color="#494bd6"
                  style={{ lineHeight: 1.15 }}
                />
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

          {/* Right Column: Real screenshot */}
          <div className="relative flex justify-center items-center w-full">
            {/* Subtle glow */}
            <div className="absolute -inset-4 rounded-[32px] blur-2xl -z-10" style={{ background: "linear-gradient(135deg, rgba(73,75,214,0.08), rgba(128,131,255,0.08))" }} />
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border" style={{ borderColor: "#e5e7eb" }}>
              <Image
                src="/quality.png"
                alt="Blog quality score screenshot"
                width={600}
                height={900}
                unoptimized
                className="w-full h-auto rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
