import os
import threading

DOWNLOAD_DIR = "/tmp/taufiqubox_downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

download_queue = {}

QUALITY_MAP = {
    "1080p": "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080]",
    "720p":  "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720]",
    "480p":  "bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480]",
}

def progress_hook(d):
    title = d.get("filename", "unknown")
    if d["status"] == "downloading":
        download_queue[title] = {
            "status": "downloading",
            "percent": d.get("_percent_str", "?").strip(),
            "speed": d.get("_speed_str", "?").strip(),
            "eta": d.get("_eta_str", "?").strip()
        }
    elif d["status"] == "finished":
        download_queue[title] = {"status": "finished", "percent": "100%"}

def download_movie(url: str, title: str, quality: str = "1080p"):
    try:
        import yt_dlp
    except ImportError:
        download_queue[title] = {"status": "error", "percent": "0%"}
        return

    safe_title = "".join(c for c in title if c.isalnum() or c in " _-").strip()
    fmt = QUALITY_MAP.get(quality, QUALITY_MAP["1080p"])

    ydl_opts = {
        "format": fmt,
        "outtmpl": f"{DOWNLOAD_DIR}/{safe_title}.%(ext)s",
        "merge_output_format": "mp4",
        "progress_hooks": [progress_hook],
        "quiet": True,
    }

    def run():
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

    t = threading.Thread(target=run)
    t.daemon = True
    t.start()

def get_download_status():
    return {"queue": download_queue}
