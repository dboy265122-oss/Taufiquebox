import httpx
import os

TMDB_API_KEY = os.getenv("TMDB_API_KEY", "YOUR_TMDB_API_KEY")
TMDB_BASE = "https://api.themoviedb.org/3"
IMG_BASE = "https://image.tmdb.org/t/p/w500"

GENRES = {
    28: "Action", 12: "Adventure", 16: "Animation",
    35: "Comedy", 80: "Crime", 99: "Documentary",
    18: "Drama", 10751: "Family", 14: "Fantasy",
    36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
    53: "Thriller", 10752: "War", 37: "Western"
}

def format_movie(movie):
    return {
        "id": movie["id"],
        "title": movie.get("title", movie.get("name", "Unknown")),
        "year": movie.get("release_date", movie.get("first_air_date", ""))[:4],
        "rating": round(movie.get("vote_average", 0), 1),
        "votes": movie.get("vote_count", 0),
        "poster": IMG_BASE + movie["poster_path"] if movie.get("poster_path") else None,
        "backdrop": "https://image.tmdb.org/t/p/original" + movie["backdrop_path"] if movie.get("backdrop_path") else None,
        "overview": movie.get("overview", ""),
        "genres": [GENRES.get(g, "") for g in movie.get("genre_ids", [])],
        "popularity": movie.get("popularity", 0)
    }

async def search_movies(query: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TMDB_BASE}/search/movie",
            params={"api_key": TMDB_API_KEY, "query": query, "language": "en-US", "page": 1}
        )
        data = resp.json()
        return [format_movie(m) for m in data.get("results", [])[:20] if m.get("poster_path")]

async def get_trending():
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TMDB_BASE}/trending/movie/week",
            params={"api_key": TMDB_API_KEY}
        )
        data = resp.json()
        return [format_movie(m) for m in data.get("results", [])[:20] if m.get("poster_path")]

async def get_by_genre(genre_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TMDB_BASE}/discover/movie",
            params={
                "api_key": TMDB_API_KEY,
                "with_genres": genre_id,
                "sort_by": "popularity.desc",
                "page": 1
            }
        )
        data = resp.json()
        return [format_movie(m) for m in data.get("results", [])[:20] if m.get("poster_path")]
