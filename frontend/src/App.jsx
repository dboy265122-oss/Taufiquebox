import { useState, useEffect, useRef } from "react";

const TMDB_KEY = "f4b115feb5ea971b3e886985afa41d90";
const TMDB = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";
const IMG_BIG = "https://image.tmdb.org/t/p/original";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
  { id: 18, name: "Drama" },
  { id: 16, name: "Animation" },
  { id: 80, name: "Crime" },
  { id: 12, name: "Adventure" },
];

const GENRE_MAP = {28:"Action",12:"Adventure",16:"Animation",35:"Comedy",80:"Crime",99:"Documentary",18:"Drama",10751:"Family",14:"Fantasy",36:"History",27:"Horror",9648:"Mystery",10749:"Romance",878:"Sci-Fi",53:"Thriller",10752:"War",37:"Western"};

async function tmdb(path, params = {}) {
  const url = new URL(`${TMDB}${path}`);
  url.searchParams.set("api_key", TMDB_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const r = await fetch(url);
  return r.json();
}

function fmt(m) {
  return {
    id: m.id,
    title: m.title || m.name || "Unknown",
    year: (m.release_date || m.first_air_date || "")?.slice(0, 4),
    rating: parseFloat((m.vote_average || 0).toFixed(1)),
    poster: m.poster_path ? IMG + m.poster_path : null,
    backdrop: m.backdrop_path ? IMG_BIG + m.backdrop_path : null,
    overview: m.overview || "",
    genres: (m.genre_ids || []).map(g => GENRE_MAP[g]).filter(Boolean),
  };
}

function Navbar({ onSearch, onHome }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) { onSearch(query.trim()); setOpen(false); setQuery(""); }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${scrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 to-transparent"}`}>
      <div className="flex items-center gap-8">
        <h1 onClick={onHome} className="text-[#E50914] font-black text-2xl tracking-tight cursor-pointer select-none">TAUFIQUBOX</h1>
        <div className="hidden md:flex gap-5 text-sm text-gray-300">
          <span onClick={onHome} className="text-white font-medium cursor-pointer hover:text-gray-300 transition">Home</span>
          {GENRES.slice(0,4).map(g => (
            <span key={g.id} className="cursor-pointer hover:text-white transition">{g.name}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {open ? (
          <form onSubmit={submit} className="flex items-center bg-black/80 border border-white/40 px-3 py-1.5 rounded">
            <svg className="w-4 h-4 text-white mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search movies..." className="bg-transparent text-white text-sm outline-none w-44"
              onBlur={() => !query && setOpen(false)} />
          </form>
        ) : (
          <button onClick={() => setOpen(true)} className="text-white hover:text-gray-300 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
}

function Hero({ movie, onPlay }) {
  if (!movie) return null;
  return (
    <div className="relative h-[85vh] overflow-hidden">
      {movie.backdrop && <img src={movie.backdrop} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />}
      <div className="absolute inset-0" style={{background:"linear-gradient(to right,#141414 35%,rgba(20,20,20,0.6) 65%,transparent)"}} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20" />
      <div className="absolute bottom-28 left-10 max-w-md">
        <h2 className="text-5xl font-black text-white mb-3 leading-tight drop-shadow-lg">{movie.title}</h2>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-green-400 font-bold text-sm">{Math.round(movie.rating * 10)}% Match</span>
          <span className="text-gray-300 text-sm">{movie.year}</span>
          <span className="border border-gray-500 text-gray-300 text-xs px-1.5 py-0.5 rounded">HD</span>
          <span className="border border-gray-500 text-gray-300 text-xs px-1.5 py-0.5 rounded">1080p</span>
        </div>
        <p className="text-gray-200 text-sm leading-relaxed mb-5 line-clamp-3">{movie.overview}</p>
        <div className="flex gap-3">
          <button onClick={() => onPlay(movie)} className="flex items-center gap-2 bg-white text-black px-7 py-2.5 rounded font-bold hover:bg-white/80 transition text-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Play
          </button>
          <button onClick={() => onPlay(movie)} className="flex items-center gap-2 bg-gray-500/60 text-white px-7 py-2.5 rounded font-bold hover:bg-gray-500/40 transition text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}

function MovieCard({ movie, onPlay }) {
  const [hov, setHov] = useState(false);
  if (!movie.poster) return null;
  return (
    <div className="relative flex-shrink-0 w-36 md:w-44 cursor-pointer transition-transform duration-200 hover:scale-105 hover:z-10"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => onPlay(movie)}>
      <img src={movie.poster} alt={movie.title} className="w-full h-56 md:h-64 object-cover rounded" loading="lazy" />
      {hov && (
        <div className="absolute inset-0 bg-black/80 rounded flex flex-col justify-end p-3">
          <p className="text-white text-xs font-bold mb-1 line-clamp-2">{movie.title}</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400 text-xs font-bold">⭐ {movie.rating}</span>
            <span className="text-gray-400 text-xs">{movie.year}</span>
          </div>
          <button className="w-full bg-white text-black text-xs py-1.5 rounded font-bold hover:bg-white/80">▶ Play</button>
        </div>
      )}
    </div>
  );
}

function MovieRow({ title, movies, onPlay }) {
  const ref = useRef(null);
  const scroll = d => ref.current?.scrollBy({ left: d * 400, behavior: "smooth" });
  if (!movies?.length) return null;
  return (
    <div className="mb-8 px-6">
      <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
      <div className="relative group">
        <button onClick={() => scroll(-1)} className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-black/60 text-white text-2xl opacity-0 group-hover:opacity-100 transition rounded-r flex items-center justify-center">‹</button>
        <div ref={ref} className="flex gap-2 overflow-x-auto pb-2" style={{scrollbarWidth:"none"}}>
          {movies.map(m => <MovieCard key={m.id} movie={m} onPlay={onPlay} />)}
        </div>
        <button onClick={() => scroll(1)} className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-black/60 text-white text-2xl opacity-0 group-hover:opacity-100 transition rounded-l flex items-center justify-center">›</button>
      </div>
    </div>
  );
}

function PlayerModal({ movie, onClose }) {
  if (!movie) return null;
  const sources = [
    `https://vidsrc.to/embed/movie/${movie.id}`,
    `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`,
    `https://www.2embed.cc/embed/${movie.id}`,
  ];
  const [srcIdx, setSrcIdx] = useState(0);
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 bg-[#141414] border-b border-gray-800">
        <div className="flex items-center gap-4">
          <span className="text-white font-bold">{movie.title}</span>
          <div className="flex gap-2">
            {["VidSrc","SuperEmbed","2Embed"].map((s,i) => (
              <button key={s} onClick={() => setSrcIdx(i)}
                className={`text-xs px-3 py-1 rounded font-semibold transition ${srcIdx===i ? "bg-[#E50914] text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-xl transition">✕</button>
      </div>
      <iframe key={srcIdx} src={sources[srcIdx]} className="flex-1 w-full border-0" allowFullScreen allow="autoplay; fullscreen" />
    </div>
  );
}

export default function App() {
  const [trending, setTrending] = useState([]);
  const [rows, setRows] = useState({});
  const [search, setSearch] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadHome(); }, []);

  async function loadHome() {
    setLoading(true);
    try {
      const td = await tmdb("/trending/movie/week");
      setTrending(td.results?.map(fmt).filter(m => m.poster) || []);
      const rowData = {};
      for (const g of GENRES.slice(0, 6)) {
        const d = await tmdb("/discover/movie", { with_genres: g.id, sort_by: "popularity.desc" });
        rowData[g.name] = (d.results || []).map(fmt).filter(m => m.poster);
      }
      setRows(rowData);
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  async function handleSearch(query) {
    const d = await tmdb("/search/movie", { query });
    setSearch({ query, results: (d.results || []).map(fmt).filter(m => m.poster) });
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar onSearch={handleSearch} onHome={() => setSearch(null)} />
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-[#E50914] text-5xl font-black mb-3">TAUFIQUBOX</div>
            <p className="text-gray-400 text-sm">Loading movies...</p>
          </div>
        </div>
      ) : search ? (
        <div className="pt-24 px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-xl font-bold">"{search.query}" — {search.results.length} results</h2>
            <button onClick={() => setSearch(null)} className="text-gray-400 hover:text-white text-sm transition">← Back</button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {search.results.map(m => <MovieCard key={m.id} movie={m} onPlay={setPlaying} />)}
          </div>
        </div>
      ) : (
        <>
          <Hero movie={trending[0]} onPlay={setPlaying} />
          <div className="-mt-20 relative z-10">
            <MovieRow title="🔥 Trending Now" movies={trending} onPlay={setPlaying} />
            {Object.entries(rows).map(([genre, movies]) => (
              <MovieRow key={genre} title={genre} movies={movies} onPlay={setPlaying} />
            ))}
          </div>
        </>
      )}
      {playing && <PlayerModal movie={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
