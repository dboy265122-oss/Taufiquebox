from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from scraper import search_movies, get_trending, get_by_genre
from downloader import download_movie, get_download_status
import uvicorn

app = FastAPI(title="TaufiquBox API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/movies/search")
async def search(query: str):
    results = await search_movies(query)
    return {"results": results}

@app.get("/movies/trending")
async def trending():
    results = await get_trending()
    return {"results": results}

@app.get("/movies/genre/{genre_id}")
async def by_genre(genre_id: int):
    results = await get_by_genre(genre_id)
    return {"results": results}

@app.get("/movies/sources/{tmdb_id}")
async def sources(tmdb_id: str, title: str):
    return {
        "sources": [
            {
                "provider": "VidSrc",
                "url": f"https://vidsrc.to/embed/movie/{tmdb_id}",
                "quality": "1080p"
            },
            {
                "provider": "SuperEmbed",
                "url": f"https://multiembed.mov/?video_id={tmdb_id}&tmdb=1",
                "quality": "1080p"
            },
            {
                "provider": "2Embed",
                "url": f"https://www.2embed.cc/embed/{tmdb_id}",
                "quality": "720p"
            }
        ]
    }

@app.post("/movies/download")
async def download(url: str, title: str, quality: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(download_movie, url, title, quality)
    return {"status": "queued", "message": f"Downloading {title} at {quality}"}

@app.get("/downloads/status")
async def download_status():
    return get_download_status()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
