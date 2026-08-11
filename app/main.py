import os 
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langgraph.graph import StateGraph,END
from typing import TypedDict,Optional

from youtube_transcript_api import YouTubeTranscriptApi


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

# 1st NODEEE
def fetch_transcript_node(state: BlogState) -> BlogState:
    video_id = extract_video_id(state["video_url"])
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = " ".join([item['text'] for item in transcript_list])
        return {"video_id": video_id, "transcript": transcript_text}
    except Exception as e:
        return {"transcript": f"Error fetching transcript: {str(e)}"}








