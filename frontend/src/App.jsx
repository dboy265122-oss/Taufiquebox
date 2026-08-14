import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "/api";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
  { id: 18, name: "Drama" },
  { id: 16, name: "Animation" },
];

function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300 ${scrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 to-transparent"}`}>
      <div className="flex items-center gap-8">
        <h1 className="text-[#E50914] font-black text-3xl tracking-tight select-none">TAUFIQUBOX</h1>
        <div className="hidden md:flex gap-6 text-sm text-gray-300">
          <span className="text-white font-medium cursor-pointer">Home</span>
          <span className="hover:text-white cursor-pointer transition">Movies</span>
          <span className="hover:text-white cursor-pointer transition">TV Shows</span>
          <span className="hover:text-white cursor-pointer transition">New & Popular</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {searching ? (
          <form onSubmit={handleSubmit} className="flex items-center bg-black/80 border border-white/50 px-3 py-1.5 rounded">
            <svg className="w-4 h-4 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Titles, genres..."
              className="bg-transparent text-white text-sm outline-none w-48"
              onBlur={() => !query && setSearching(false)}
            />
          </form>
        ) : (
          <button onClick={() => setSearching(true)} className="text-white hover:text-gray-300 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
}

function Hero({ movie, onPlay, onDownload }) {
  if (!movie) return null;
  return (
    <div className="relative h-[80vh] overflow-hidden">
      {movie.backdrop && (
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20" />
      <div className="absolute bottom-32 left-12 max-w-lg">
        <h2 className="text-5xl font-black text-white mb-3 leading-tight">{movie.title}</h2>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-green-400 font-bold">{movie.rating * 10}% Match</span>
          <span className="text-gray-300 text-sm">{movie.year}</span>
          <span className="border border-gray-500 text-gray-300 text-xs px-1.5 py-0.5 rounded">HD</span>
        </div>
        <p className="text-gray-200 text-sm leading-relaxed mb-6 line-clamp-3">{movie.overview}</p>
        <div className="flex gap-3">
          <button
            onClick={() => onPlay(movie)}
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded font-bold hover:bg-white/80 transition text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          </button>
          <button
            onClick={() => onDownload(movie)}
            className="flex items-center gap-2 bg-gray-500/70 text-white px-6 py-2.5 rounded font-bold hover:bg-gray-500/50 transition text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

function MovieCard({ movie, onPlay, onDownload }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="movie-card relative flex-shrink-0 w-40 md:w-48 cursor-pointer transition-transform duration-200 hover:scale-105 hover:z-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-60 md:h-72 object-cover rounded"
        loading="lazy"
      />
      {hovered && (
        <div className="movie-overlay absolute inset-0 bg-black/80 rounded flex flex-col justify-end p-3 transition-opacity duration-200">
          <p className="text-white text-xs font-bold mb-1 line-clamp-2">{movie.title}</p>
          <div className="flex items-center gap-1 mb-2">
            <span className="text-green-400 text-xs font-bold">{movie.rating}</span>
            <span className="text-gray-400 text-xs">⭐ {movie.year}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onPlay(movie)}
              className="flex-1 bg-white text-black text-xs py-1.5 rounded font-bold hover:bg-white/80 transition"
            >
              ▶ Play
            </button>
            <button
              onClick={() => onDownload(movie)}
              className="bg-gray-600 text-white text-xs px-2 py-1.5 rounded hover:bg-gray-500 transition"
              title="Download"
            >
              ⬇
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MovieRow({ title, movies, onPlay, onDownload }) {
  const rowRef = useRef(null);
  const scroll = (dir) => {
    rowRef.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  };

  if (!movies.length) return null;

  return (
    <div className="mb-8 px-8">
      <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
      <div className="relative group">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded"
        >
          ‹
        </button>
        <div ref={rowRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: "none" }}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onPlay={onPlay} onDownload={onDownload} />
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function PlayerModal({ movie, onClose }) {
  if (!movie) return null;
  const embedUrl = `https://vidsrc.to/embed/movie/${movie.id}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 bg-[#141414]">
        <span className="text-white font-bold text-lg">{movie.title}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition">✕</button>
      </div>
      <div className="flex-1">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen"
          frameBorder="0"
        />
      </div>
    </div>
  );
}

function DownloadModal({ movie, onClose, onConfirm }) {
  const [quality, setQuality] = useState("1080p");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    await onConfirm(movie, quality);
    setLoading(false);
    onClose();
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 w-96 shadow-2xl">
        <div className="flex items-start gap-4 mb-6">
          {movie.poster && <img src={movie.poster} alt={movie.title} className="w-16 h-24 object-cover rounded" />}
          <div>
            <h3 className="text-white font-bold text-lg mb-1">{movie.title}</h3>
            <p className="text-gray-400 text-sm">{movie.year} · ⭐ {movie.rating}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genres?.slice(0, 3).map(g => (
                <span key={g} className="text-xs text-gray-400 border border-gray-600 px-1.5 py-0.5 rounded">{g}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2 font-semibold">Select Quality</p>
          <div className="flex gap-2">
            {["1080p", "720p", "480p"].map(q => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`flex-1 py-2 rounded text-sm font-bold border transition ${quality === q ? "bg-[#E50914] border-[#E50914] text-white" : "bg-transparent border-gray-600 text-gray-300 hover:border-gray-400"}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold transition">
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={loading}
            className="flex-1 py-2.5 rounded bg-[#E50914] hover:bg-[#b8070f] text-white text-sm font-bold transition disabled:opacity-50"
          >
            {loading ? "Queuing..." : "⬇ Download"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DownloadQueue({ queue, onClear }) {
  const items = Object.entries(queue);
  if (!items.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl w-80">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <span className="text-white text-sm font-bold">Downloads ({items.length})</span>
        <button onClick={onClear} className="text-gray-500 hover:text-white text-xs transition">Clear</button>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {items.map(([filename, info]) => (
          <div key={filename} className="px-4 py-3 border-b border-gray-800 last:border-0">
            <p className="text-gray-300 text-xs truncate mb-1">{filename.split("/").pop()}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${info.status === "finished" ? "text-green-400" : "text-yellow-400"}`}>
                {info.status === "finished" ? "✓ Complete" : `${info.percent} · ${info.speed}`}
              </span>
              {info.eta && info.status !== "finished" && (
                <span className="text-gray-500 text-xs">ETA {info.eta}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [trending, setTrending] = useState([]);
  const [genreRows, setGenreRows] = useState({});
  const [searchResults, setSearchResults] = useState(null);
  const [playingMovie, setPlayingMovie] = useState(null);
  const [downloadMovie, setDownloadMovie] = useState(null);
  const [downloadQueue, setDownloadQueue] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHome();
    const interval = setInterval(pollDownloads, 3000);
    return () => clearInterval(interval);
  }, []);

  async function loadHome() {
    setLoading(true);
    const { data } = await axios.get(`${API}/movies/trending`);
    setTrending(data.results);

    const rows = {};
    for (const genre of GENRES.slice(0, 5)) {
      const { data: gd } = await axios.get(`${API}/movies/genre/${genre.id}`);
      rows[genre.name] = gd.results;
    }
    setGenreRows(rows);
    setLoading(false);
  }

  async function handleSearch(query) {
    const { data } = await axios.get(`${API}/movies/search`, { params: { query } });
    setSearchResults({ query, results: data.results });
  }

  async function handleDownloadConfirm(movie, quality) {
    const { data: srcData } = await axios.get(`${API}/movies/sources/${movie.id}`, {
      params: { title: movie.title }
    });
    if (!srcData.sources.length) { alert("No sources found."); return; }
    const src = srcData.sources[0];
    await axios.post(`${API}/movies/download`, null, {
      params: { url: src.url, title: movie.title, quality }
    });
  }

  async function pollDownloads() {
    try {
      const { data } = await axios.get(`${API}/downloads/status`);
      setDownloadQueue(data.queue || {});
    } catch (_) {}
  }

  const heroMovie = trending[0] || null;
  const displayMovies = searchResults ? searchResults.results : null;

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar onSearch={handleSearch} />

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-[#E50914] text-6xl font-black mb-4">TAUFIQUBOX</div>
            <p className="text-gray-400">Loading your movies...</p>
          </div>
        </div>
      ) : (
        <>
          {!searchResults && <Hero movie={heroMovie} onPlay={setPlayingMovie} onDownload={setDownloadMovie} />}

          <div className={searchResults ? "pt-24" : "-mt-16 relative z-10"}>
            {searchResults ? (
              <div className="px-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-xl font-bold">
                    Results for "{searchResults.query}" — {searchResults.results.length} found
                  </h2>
                  <button onClick={() => setSearchResults(null)} className="text-gray-400 hover:text-white text-sm transition">
                    ← Back
                  </button>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                  {searchResults.results.map(movie => (
                    <MovieCard key={movie.id} movie={movie} onPlay={setPlayingMovie} onDownload={setDownloadMovie} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <MovieRow title="Trending Now" movies={trending} onPlay={setPlayingMovie} onDownload={setDownloadMovie} />
                {Object.entries(genreRows).map(([genre, movies]) => (
                  <MovieRow key={genre} title={genre} movies={movies} onPlay={setPlayingMovie} onDownload={setDownloadMovie} />
                ))}
              </>
            )}
          </div>
        </>
      )}

      {playingMovie && <PlayerModal movie={playingMovie} onClose={() => setPlayingMovie(null)} />}
      {downloadMovie && (
        <DownloadModal
          movie={downloadMovie}
          onClose={() => setDownloadMovie(null)}
          onConfirm={handleDownloadConfirm}
        />
      )}
      <DownloadQueue queue={downloadQueue} onClear={() => setDownloadQueue({})} />
    </div>
  );
}
