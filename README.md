# 🎬 TaufiquBox

> Netflix-style free movie streaming & downloader. Every movie. Every genre. Up to 1080p. Free.

![TaufiquBox](https://img.shields.io/badge/TaufiquBox-v1.0-E50914?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge)

---

## Features

- Netflix-identical dark UI — same layout, same vibes
- Browse trending movies + genres (Action, Horror, Sci-Fi, Thriller...)
- Search any movie from TMDB's full catalog
- Stream directly in-browser via embedded player
- Download up to **1080p** via yt-dlp engine
- Live download queue with progress tracking
- Auto genre rows — fully automated

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Python FastAPI + Uvicorn |
| Movie Data | TMDB API (free) |
| Stream Sources | VidSrc, SuperEmbed, 2Embed |
| Downloader | yt-dlp + FFmpeg |

---

## Setup

### 1. Get TMDB API Key (free)
Go to [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) → create account → get free API key.

### 2. Backend

```bash
cd Taufiquebox
pip install -r requirements.txt

# Set your TMDB key
export TMDB_API_KEY=your_key_here

# Run
python backend/main.py
```

Backend runs on `http://localhost:8000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Install FFmpeg (required for 1080p downloads)

**Windows:**
```bash
winget install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

**Mac:**
```bash
brew install ffmpeg
```

---

## Download Quality

| Quality | Format |
|---------|--------|
| 1080p | MP4 H.264 + AAC |
| 720p | MP4 H.264 + AAC |
| 480p | MP4 H.264 + AAC |

All downloads saved to `./downloads/` folder.

---

## Project Structure

```
Taufiquebox/
├── backend/
│   ├── main.py          # FastAPI routes
│   ├── scraper.py       # TMDB movie fetcher
│   └── downloader.py    # yt-dlp download engine
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Full Netflix-style UI
│   │   ├── main.jsx     # React entry
│   │   └── index.css    # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── requirements.txt
└── README.md
```

---

## Built by baby. Shipped by Onyx. 6767.
