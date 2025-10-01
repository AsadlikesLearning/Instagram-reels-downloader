#!/usr/bin/env python3
"""
Python-based YouTube Downloader for Next.js Integration
"""
import os
import sys
import json
import glob
import time
from pathlib import Path
from yt_dlp import YoutubeDL

# Global cookie cache to avoid repeated browser cookie extraction
_cookie_cache = None
_cookie_cache_time = 0
COOKIE_CACHE_DURATION = 300  # 5 minutes

def cleanup_incomplete_downloads(downloads_dir="downloads"):
    """Clean up incomplete download files (.part, .ytdl, .temp files)"""
    if not os.path.exists(downloads_dir):
        return

    cleanup_patterns = [
        "*.part", "*.ytdl", "*.temp",
        "*.part-Frag*", "*.f*.mp4.part*", "*.f*.mp4.ytdl"
    ]

    for pattern in cleanup_patterns:
        for file_path in glob.glob(os.path.join(downloads_dir, "**", pattern), recursive=True):
            try:
                os.remove(file_path)
            except Exception:
                pass

def get_cached_cookies():
    """Get cached cookies or extract fresh ones"""
    global _cookie_cache, _cookie_cache_time
    
    current_time = time.time()
    if _cookie_cache and (current_time - _cookie_cache_time) < COOKIE_CACHE_DURATION:
        return _cookie_cache
    
    # Extract fresh cookies
    try:
        class QuietLogger:
            def debug(self, msg):
                pass
            def warning(self, msg):
                pass
            def error(self, msg):
                pass

        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'cookiesfrombrowser': ('chrome',),
            'logger': QuietLogger(),
        }
        with YoutubeDL(ydl_opts) as ydl:
            # Just extract cookies without downloading
            _cookie_cache = ydl.cookiejar
            _cookie_cache_time = current_time
            return _cookie_cache
    except Exception:
        return None

def get_video_info(url):
    """Get video information without downloading"""
    class QuietLogger:
        def debug(self, msg):
            pass
        def warning(self, msg):
            pass
        def error(self, msg):
            pass

    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
        # Use cached cookies for better performance
        'cookiejar': get_cached_cookies(),
        # Performance optimizations
        'no_check_certificate': True,
        'ignoreerrors': True,
        'no_color': True,
        'simulate': True,  # Don't download, just extract info
        'progress': False,
        'logger': QuietLogger(),
        # Additional performance optimizations
        'socket_timeout': 30,
        'retries': 2,
        'fragment_retries': 2,
        'skip_unavailable_fragments': True,
        'sleep_interval': 0,
        'max_sleep_interval': 0,
        'http_chunk_size': 1048576,  # 1MB chunks
        'concurrent_fragment_downloads': 1,
        'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    try:
        # Try with optimized settings first
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Check if info extraction was successful
            if info is None:
                return {
                    'success': False,
                    'error': 'Failed to extract video information. The video may be private, age-restricted, or unavailable.'
                }
            
            # Validate that we have at least a title
            if not info.get('title'):
                return {
                    'success': False,
                    'error': 'Video title not found. The video may be private, age-restricted, or unavailable.'
                }
            
            return {
                'success': True,
                'data': {
                    'id': info.get('id', ''),
                    'title': info.get('title', ''),
                    'description': info.get('description', ''),
                    'duration': info.get('duration', 0),
                    'thumbnail': info.get('thumbnail', ''),
                    'uploader': info.get('uploader', ''),
                    'view_count': info.get('view_count', 0),
                    'upload_date': info.get('upload_date', ''),
                    'webpage_url': info.get('webpage_url', url)
                }
            }
    except Exception as e:
        error_msg = str(e)
        # Log the actual error for debugging
        print(f"DEBUG: yt-dlp error (first attempt): {error_msg}", file=sys.stderr)
        
        # Try fallback with simpler settings
        try:
            print("DEBUG: Trying fallback with simpler settings...", file=sys.stderr)
            fallback_opts = {
                'quiet': True,
                'no_warnings': True,
                'extract_flat': False,
                'simulate': True,
                'no_check_certificate': True,
                'ignoreerrors': True,
                'socket_timeout': 15,
                'retries': 1,
                'logger': QuietLogger(),
            }
            
            with YoutubeDL(fallback_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
                if info is None or not info.get('title'):
                    raise Exception("Fallback also failed")
                
                return {
                    'success': True,
                    'data': {
                        'id': info.get('id', ''),
                        'title': info.get('title', ''),
                        'description': info.get('description', ''),
                        'duration': info.get('duration', 0),
                        'thumbnail': info.get('thumbnail', ''),
                        'uploader': info.get('uploader', ''),
                        'upload_date': info.get('upload_date', ''),
                        'webpage_url': info.get('webpage_url', url),
                        'view_count': info.get('view_count', 0),
                        'like_count': info.get('like_count', 0),
                        'comment_count': info.get('comment_count', 0)
                    }
                }
        except Exception as fallback_error:
            print(f"DEBUG: Fallback also failed: {fallback_error}", file=sys.stderr)
            
            # Provide more specific error messages - be more precise with detection
            if '403' in error_msg or 'Forbidden' in error_msg:
                return {
                    'success': False,
                    'error': 'YouTube is blocking automated access. Please try again later or use a different video.'
                }
            elif 'Private video' in error_msg or 'This video is private' in error_msg:
                return {
                    'success': False,
                    'error': 'This video is private and cannot be accessed.'
                }
            elif 'age-restricted' in error_msg.lower() and 'video' in error_msg.lower():
                return {
                    'success': False,
                    'error': 'This video is age-restricted and cannot be accessed.'
                }
            elif 'Video unavailable' in error_msg or 'This video is unavailable' in error_msg:
                return {
                    'success': False,
                    'error': 'This video is unavailable or has been removed.'
                }
            else:
                return {
                    'success': False,
                    'error': f'Failed to extract video info: {error_msg}'
                }

def download_video(url, output_path, filename=None, audio_only=False):
    """Download a single YouTube video or audio and return result"""
    try:
        # Create output directory
        Path(output_path).mkdir(parents=True, exist_ok=True)
        
        # Generate filename if not provided
        if not filename:
            filename = "%(title)s.%(ext)s"
        
        class QuietLogger:
            def debug(self, msg):
                pass
            def warning(self, msg):
                pass
            def error(self, msg):
                pass

        if audio_only:
            # Audio-only download configuration
            # Remove .mp3 extension from filename if it exists to avoid double extension
            base_filename = filename
            if filename.endswith('.mp3'):
                base_filename = filename[:-4]
            
            ydl_opts = {
                'outtmpl': os.path.join(output_path, base_filename + '.%(ext)s'),
                'noplaylist': True,
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'quiet': True,
                'no_warnings': True,
                # Use cached cookies for better performance
                'cookiejar': get_cached_cookies(),
                # Performance optimizations
                'no_check_certificate': True,
                'ignoreerrors': True,
                'no_color': True,
                'concurrent_fragment_downloads': 4,
                'fragment_retries': 3,
                'retries': 3,
                'socket_timeout': 30,
                'progress': False,
                'logger': QuietLogger(),
            }
        else:
            # Video download configuration
            ydl_opts = {
                'outtmpl': os.path.join(output_path, filename),
                'noplaylist': True,
                'format': 'bestvideo[height<=1080]+bestaudio/best[height<=1080]/best',
                'merge_output_format': 'mp4',
                'quiet': True,
                'no_warnings': True,
                # Use cached cookies for better performance
                'cookiejar': get_cached_cookies(),
                # Performance optimizations
                'no_check_certificate': True,
                'ignoreerrors': True,
                'no_color': True,
                'concurrent_fragment_downloads': 4,
                'fragment_retries': 3,
                'retries': 3,
                'socket_timeout': 30,
                'progress': False,
                'logger': QuietLogger(),
            }

        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            downloaded_filename = ydl.prepare_filename(info)
            
            # Cleanup incomplete downloads
            cleanup_incomplete_downloads(output_path)
            
            # For audio downloads, the actual filename might be different due to postprocessing
            if audio_only:
                # Look for the actual MP3 file that was created
                actual_filename = base_filename + '.mp3'
                actual_filepath = os.path.join(output_path, actual_filename)
                if os.path.exists(actual_filepath):
                    return {
                        'success': True,
                        'filePath': actual_filepath,
                        'filename': actual_filename
                    }
            
            return {
                'success': True,
                'filePath': downloaded_filename,
                'filename': os.path.basename(downloaded_filename)
            }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 3:
        print(json.dumps({
            'success': False,
            'error': 'Invalid arguments. Usage: python_downloader.py <action> <url> [output_path] [filename] [audio_only]'
        }))
        sys.exit(1)
    
    action = sys.argv[1]
    url = sys.argv[2]
    output_path = sys.argv[3] if len(sys.argv) > 3 else '/tmp/youtube-downloads'
    filename = sys.argv[4] if len(sys.argv) > 4 else None
    audio_only = sys.argv[5] if len(sys.argv) > 5 else 'false'
    
    if action == 'info':
        result = get_video_info(url)
    elif action == 'download':
        result = download_video(url, output_path, filename, audio_only.lower() == 'true')
    else:
        result = {
            'success': False,
            'error': f'Invalid action: {action}. Use "info" or "download"'
        }
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()
