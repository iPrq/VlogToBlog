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

# 1st NODEEE
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

#2nd NODEEE
def generate_outline_node(state: BlogState) -> dict:
    """Uses Gemini 3.1 Flash-Lite to ingest large transcript and extract structure."""
    OUTLINE_PROMPT = """
    You are an expert technical editor and content strategist. 
    Your goal is to transform an unorganized spoken YouTube transcript into a structured, highly engaging blog post outline.

    TRANSCRIPT:
    {transcript}

    ### DIRECTIVES:
    1. **Target Audience:** Technical developers and tech-savvy readers.
    2. **Logical Flow:** Reorganize the transcript into a coherent narrative. Fix spoken tangents, repetitive statements, or filler conversation.
    3. **Hierarchy:** Create 4 to 6 main H2 sections. Under each H2, list 2-3 H3 subsections or key bullet points.
    4. **Context Notes:** Under every section, write 1-2 sentences explicitly detailing WHAT raw facts, code concepts, or arguments from the transcript must be covered.

    ### OUTPUT FORMAT:
    Return ONLY the raw Markdown outline. Do not include introductory conversational filler like "Here is your outline:".
    """
    response = gemini_llm.invoke(OUTLINE_PROMPT.format(transcript=state['transcript']))
    return {"outline": extract_text_content(response.content)}

#3rd NODEEE
def write_draft_node(state: BlogState) -> dict:
    """Uses Llama 3.3 70B via Groq to generate rich narrative prose."""

    transcript_excerpt = state['transcript'][:8000] # Safe token buffer for 12k TPM
    
    WRITER_PROMPT = """
        You are a senior technical writer. Your task is to write a comprehensive, publication-ready blog post based on the provided outline and transcript excerpt.

        OUTLINE:
        {outline}

        TRANSCRIPT CONTEXT:
        {transcript_excerpt}

        ### STRICT RULES:
        1. **Never Mention the Video:** DO NOT use phrases like "In this video", "The speaker says", "Welcome back to the channel", or "As discussed earlier". Write as an original author.
        2. **Tone & Style:** Authoritative, clear, and engaging. Use active voice and short, readable paragraphs.
        3. **Code & Examples:** If the context mentions code, syntax, or architecture, format them cleanly in standard Markdown code blocks (`python` or `bash`).
        4. **Depth:** Expand thoroughly on every bullet point in the outline. Target a comprehensive length (1,200 to 1,800 words).
        5. **Formatting:** Use strong bolding for key terms, blockquotes for important takeaways, and clean H2/H3 headers matching the outline.

        Write the draft now:
        """
    response = groq_llm.invoke(WRITER_PROMPT.format(outline=state['outline'], transcript_excerpt=transcript_excerpt))
    return {"blog_draft": extract_text_content(response.content)}


#4th NODEEE
def seo_refine_node(state: BlogState) -> dict:
    """Uses Gemini 3.1 Flash-Lite for fast formatting and metadata generation."""
    SEO_PROMPT = """
    You are an SEO Specialist and Content Formatter. Your job is to polish a blog post draft for final web publication without altering the author's original core technical content.

    DRAFT:
    {blog_draft}

    ### TASKS:
    1. **Metadata Header:** At the very top, generate:
    - **Title (H1):** Catchy, click-worthy, SEO-optimized title under 60 characters.
    - **Meta Description:** Engaging summary between 140–160 characters.
    - **Key Takeaways Box:** A Markdown blockquote with 3–4 bulleted core lessons.
    2. **Body Cleanup:** Fix any minor grammar, awkward sentence phrasing, or broken Markdown formatting in the draft body.
    3. **Call To Action:** End with a clean, standard technical discussion question prompt for readers.

    Return the final, publish-ready Markdown document:
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
