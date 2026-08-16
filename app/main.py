import os 
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langgraph.graph import StateGraph,END,START
from typing import TypedDict,Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi
from pydantic import BaseModel

app = FastAPI(title="Youtube to Blog Post Generator", description="A pipeline that converts YouTube video transcripts into structured, SEO-optimized blog posts using Gemini 3.1 and Llama 3.3 via Groq.", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

gemini_llm = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    temperature=0.7)

groq_llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.7
)

class BlogState(TypedDict):
    video_url: str
    video_id: str
    transcript: Optional[str]
    outline: Optional[str]
    blog_draft: Optional[str]
    seo_blog: Optional[str]

# Helper Function
def extract_video_id(url: str) -> str:
    if "v=" in url:
        return url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    return url

def extract_text_content(content) -> str:
    if isinstance(content, str):
        return content
    elif isinstance(content, list):
        texts = []
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                texts.append(block.get("text", ""))
            elif isinstance(block, str):
                texts.append(block)
        return "".join(texts)
    return str(content)

# 1st NODE: Fetch Transcript
def fetch_transcript_node(state: BlogState) -> BlogState:
    video_id = extract_video_id(state["video_url"])
    try:
        api = YouTubeTranscriptApi()
        transcript_list = api.fetch(video_id)
        transcript_text = " ".join([item.text for item in transcript_list])
        if not transcript_text.strip():
            raise ValueError("Transcript is empty")
        return {"video_id": video_id, "transcript": transcript_text}
    except Exception as e:
        raise ValueError(f"Failed to fetch transcript: {str(e)}") from e

# 2nd NODE: Generate Outline
def generate_outline_node(state: BlogState) -> dict:
    """Uses Gemini 3.1 Flash-Lite to ingest large transcript and extract structure."""
    OUTLINE_PROMPT = """
    You are an expert technical editor and content strategist. 
    Your goal is to transform an unorganized spoken YouTube transcript into a structured, highly engaging blog post outline.

    TRANSCRIPT:
    {transcript}

    ### DIRECTIVES:
    1. Target Audience: Technical developers and tech-savvy readers.
    2. Logical Flow: Reorganize transcript into a coherent narrative. Fix spoken tangents or repetitive statements.
    3. Hierarchy: Use Markdown `#` for main title, `##` for H2 sections, and `###` for sub-sections.
    4. Context Notes: Under every section, list 2-3 explicit bullet points with raw facts or arguments to cover.

    ### OUTPUT FORMAT:
    Return ONLY raw Markdown without conversational filler.
    """
    response = gemini_llm.invoke(OUTLINE_PROMPT.format(transcript=state['transcript']))
    return {"outline": extract_text_content(response.content)}

# 3rd NODE: Write Draft
def write_draft_node(state: BlogState) -> dict:
    """Uses Llama 3.3 70B via Groq to generate rich narrative prose."""

    transcript_excerpt = state['transcript'][:8000] # Safe token buffer
    
    WRITER_PROMPT = """
        You are a senior technical writer. Your task is to write a comprehensive, publication-ready blog post based on the outline and transcript.

        OUTLINE:
        {outline}

        TRANSCRIPT CONTEXT:
        {transcript_excerpt}

        ### STRICT RULES:
        1. **Never Mention the Video:** DO NOT use phrases like "In this video", "The speaker says", or "Welcome back".
        2. **Formatting:** MUST use `##` for section headings and `###` for subheadings. DO NOT write unformatted plain-text headers.
        3. **Lists & Bolding:** Use `- ` for bullet lists. Use **bolding** for important technical terms.
        4. **Code & Syntax:** Format any code or commands in Markdown code blocks (`python` or `bash`).
        5. **Paragraphs:** Separate paragraphs with double newlines for clear readability.

        Write the full draft in GitHub Flavored Markdown now:
        """
    response = groq_llm.invoke(WRITER_PROMPT.format(outline=state['outline'], transcript_excerpt=transcript_excerpt))
    return {"blog_draft": extract_text_content(response.content)}

# 4th NODE: SEO Refine & Final Formatting
def seo_refine_node(state: BlogState) -> dict:
    """Uses Gemini 3.1 Flash-Lite for fast formatting and metadata generation."""
    SEO_PROMPT = """
    You are an SEO Specialist and Content Formatter. Your job is to format and polish this technical blog post for web publication.

    DRAFT:
    {blog_draft}

    ### FORMATTING REQUIREMENTS:
    Format the entire document using strict GitHub Flavored Markdown:

    1. **Title:** Must start with `# ` at the very top (e.g. `# The Cancer "Cure" Myth: Why We Need a Strategy Shift`).
    2. **Meta Description:** Must be formatted as a blockquote right below title:
       `> **Meta Description:** ...`
    3. **Key Takeaways Section:** Must be formatted as:
       `## Key Takeaways`
       Followed by a bulleted list starting with `- **Concept:** Explanation` for each takeaway.
    4. **Body Headings:** Ensure ALL main sections start with `## ` and subsections start with `### `. Never leave bare unformatted text headers.
    5. **Paragraph Spacing:** Put a blank line between every paragraph, list, and header.

    Return the final publish-ready Markdown document now:
    """
    response = gemini_llm.invoke(SEO_PROMPT.format(blog_draft=state['blog_draft']))
    return {"seo_blog": extract_text_content(response.content)}
    
builder = StateGraph(BlogState)

builder.add_node("Fetch Transcript", fetch_transcript_node)
builder.add_node("Generate Outline", generate_outline_node)
builder.add_node("Write Draft", write_draft_node)
builder.add_node("SEO Refine", seo_refine_node)

builder.set_entry_point("Fetch Transcript")
builder.add_edge("Fetch Transcript", "Generate Outline")
builder.add_edge("Generate Outline", "Write Draft")
builder.add_edge("Write Draft", "SEO Refine")
builder.add_edge("SEO Refine", END)

graph = builder.compile()

class VideoURLRequest(BaseModel):
    video_url: str

@app.post("/generate")
async def generate_blog_post(request: VideoURLRequest):        
    try:
        initial_state = {"video_url": request.video_url}
        final_state = graph.invoke(initial_state)
        return {
            "video_id": final_state.get("video_id"),
            "transcript": final_state.get("transcript"),
            "outline": final_state.get("outline"),
            "blog_draft": final_state.get("blog_draft"),
            "seo_blog": final_state.get("seo_blog")
        }
    except Exception as e:
        print(f"Generation failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
