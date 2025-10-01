#!/usr/bin/env python3
"""
Debug script to test YouTube video extraction
"""
import sys
import json
from python_downloader import get_video_info

def test_youtube_video(url):
    """Test a YouTube video URL and show detailed results"""
    print(f"Testing YouTube URL: {url}")
    print("=" * 50)
    
    result = get_video_info(url)
    
    print("Result:")
    print(json.dumps(result, indent=2))
    
    if result['success']:
        print("\n✅ Success!")
        print(f"Title: {result['data']['title']}")
        print(f"Duration: {result['data']['duration']}")
        print(f"Uploader: {result['data']['uploader']}")
    else:
        print(f"\n❌ Failed: {result['error']}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 debug_youtube.py <youtube_url>")
        sys.exit(1)
    
    url = sys.argv[1]
    test_youtube_video(url)
