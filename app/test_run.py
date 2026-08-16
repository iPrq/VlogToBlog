import sys
from main import graph

def main():
    if len(sys.argv) < 2:
        # Default to a known video with transcript if no URL is provided
        url = "https://www.youtube.com/watch?v=o0AgxwWrKSE"
        print(f"No URL provided. Using default test video: {url}\n")
    else:
        url = sys.argv[1]
        
    print(f"Running LangGraph pipeline for video: {url}")
    try:
        result = graph.invoke({"video_url": url})
        
        transcript = result.get("transcript") or ""
        outline = result.get("outline") or ""
        blog_draft = result.get("blog_draft") or ""
        seo_blog = result.get("seo_blog") or ""
        
        print("\n=== Transcript (Preview) ===")
        print(transcript[:300] + "..." if len(transcript) > 300 else transcript)
        
        print("\n=== Outline ===")
        print(outline)
        
        print("\n=== Blog Draft (Preview) ===")
        print(blog_draft[:300] + "..." if len(blog_draft) > 300 else blog_draft)
        
        print("\n=== SEO Blog (Final Output) ===")
        print(seo_blog)
        
        # Save output to a markdown file
        with open("blog_output.md", "w", encoding="utf-8") as f:
            f.write(seo_blog)
        print("\n[SUCCESS] Generated blog saved to app/blog_output.md")
        
    except Exception as e:
        print(f"\n[ERROR] Execution failed: {e}")

if __name__ == "__main__":
    main()
