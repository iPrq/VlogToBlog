# VtoB — YouTube Video to Blog Post Generator

> Transform any YouTube video into a publish-ready, SEO-optimized blog post in seconds.

VtoB is a full-stack application that takes a YouTube URL, extracts the transcript, and runs it through a multi-stage AI pipeline to produce structured, professional blog posts — ready to publish on Dev.to, Hashnode, or your own site.

---

## ✨ Features

- **One-Click Conversion** — Paste a YouTube URL, get a formatted Markdown blog post
- **Multi-Model AI Pipeline** — Gemini 3.1 Flash-Lite for structure + Llama 3.3 70B for prose
- **SEO Optimized** — Auto-generated titles, meta descriptions, key takeaways, and heading hierarchy
- **Copy & Export** — Copy Markdown to clipboard, download `.md`, or export to Dev.to / Hashnode
- **Beautiful Dark UI** — Animated hero section with WebGL light rays, blur text effects, and glassmorphism


---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                        │
│         (Hero + URL Input → /generate Blog Viewer)          │
└──────────────────────┬──────────────────────────────────────┘
                       │ POST /generate { video_url }
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend (LangGraph)                │
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│  │   1. Fetch    │──▶│  2. Generate  │──▶│   3. Write   │   │
│  │  Transcript   │   │   Outline     │   │    Draft     │   │
│  │  (YT API)     │   │  (Gemini)     │   │  (Llama 3.3) │   │
│  └──────────────┘   └──────────────┘   └──────┬───────┘    │
│                                                │            │
│                                       ┌────────▼───────┐   │
│                                       │  4. SEO Refine  │   │
│                                       │    (Gemini)     │   │
│                                       └────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, Tailwind CSS v4, React, TypeScript |
| **Animations** | GSAP (StrokeText), Motion (BlurText), OGL (LightRays WebGL) |
| **Backend** | FastAPI, LangGraph (StateGraph) |
| **LLMs** | Google Gemini 3.1 Flash-Lite, Llama 3.3 70B via Groq |
| **Transcript** | `youtube-transcript-api` |
| **Deployment** | Docker (Hugging Face Spaces) |

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+** with [uv](https://docs.astral.sh/uv/) (or pip)
- **Node.js 18+** with npm
- API keys for [Google AI](https://aistudio.google.com/apikey) and [Groq](https://console.groq.com/keys)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/VtoB.git
cd VtoB
```

### 2. Backend Setup

```bash
cd app

# Create .env file with your API keys
echo "GOOGLE_API_KEY=your_google_api_key" > .env
echo "GROQ_API_KEY=your_groq_api_key" >> .env

# Install dependencies and run
uv sync
uv run uvicorn main:app --reload
```

The API server starts at **http://127.0.0.1:8000**. Visit http://127.0.0.1:8000/docs for interactive Swagger docs.

### 3. Frontend Setup

```bash
cd vtob

npm install
npm run dev
```

The frontend starts at **http://localhost:3000**.

---

## 📡 API Reference

### `POST /generate`

Converts a YouTube video into a blog post.

**Request Body:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "video_id": "VIDEO_ID",
  "transcript": "raw transcript text...",
  "outline": "## Section 1\n### Subsection...",
  "blog_draft": "full draft in markdown...",
  "seo_blog": "# Final Title\n\n> **Meta Description:** ..."
}
```

---

## 🐳 Docker Deployment (Hugging Face Spaces)

The `app/` directory is ready for Hugging Face Spaces with Docker SDK:

```bash
cd app
docker build -t vtob-api .
docker run -p 7860:7860 \
  -e GOOGLE_API_KEY=your_key \
  -e GROQ_API_KEY=your_key \
  vtob-api
```

Or push directly to a Hugging Face Space:

```bash
cd app
git init
git remote add origin https://huggingface.co/spaces/YOUR_USERNAME/vtob-api
git add Dockerfile main.py requirements.txt README.md
git commit -m "Deploy VtoB API"
git push origin main
```

Set `GOOGLE_API_KEY` and `GROQ_API_KEY` as **Secrets** in your Space settings.

---

## 📂 Project Structure

```
VtoB/
├── app/                    # Backend (FastAPI + LangGraph)
│   ├── main.py             # API server & AI pipeline
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # HF Spaces Docker config
│   ├── .dockerignore
│   └── .env                # API keys (not committed)
│
└── vtob/                   # Frontend (Next.js)
    ├── app/
    │   ├── page.tsx        # Homepage with hero section
    │   ├── generate/
    │   │   └── page.tsx    # Blog generation & viewer page
    │   ├── layout.tsx      # Root layout & metadata
    │   └── globals.css     # Design system & animations
    ├── components/
    │   ├── StrokeText.tsx   # GSAP animated text drawing
    │   ├── BlurText.tsx     # Motion blur entrance animation
    │   └── LightRays.tsx    # OGL WebGL light rays effect
    └── public/
        ├── logo.png         # Site favicon
        └── quality.png      # Feature section image
```

---

## 📄 License

MIT
