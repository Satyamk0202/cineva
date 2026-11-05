import React, { useEffect, useMemo, useState } from 'react';
import './index.css';

const IMG = 'https://image.tmdb.org/t/p/';
const movies = [
  { id: 1, title: 'Dune: Part Two', year: 2024, genre: 'Sci-Fi', rating: '8.5', runtime: '166 min', poster: '1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', backdrop: 'xOMo8BRK7PFCJv9JC951vS4Xq1g.jpg', desc: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.' },
  { id: 2, title: 'Interstellar', year: 2014, genre: 'Sci-Fi', rating: '8.7', runtime: '169 min', poster: 'gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', backdrop: 'rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg', desc: 'A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.' },
  { id: 3, title: 'Spider-Man: Across the Spider-Verse', year: 2023, genre: 'Animation', rating: '8.6', runtime: '140 min', poster: '8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', backdrop: '4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg', desc: 'Miles Morales is catapulted across the multiverse, where he meets a team of Spider-People protecting its existence.' },
  { id: 4, title: 'Oppenheimer', year: 2023, genre: 'Drama', rating: '8.3', runtime: '180 min', poster: 'ptpr0kGAckfQkJeJIt8st5dglvd.jpg', backdrop: 'fm6KqXpk3M2 HVveHwCrBSSBaO0V.jpg'.replace(' ', ''), desc: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.' },
  { id: 5, title: 'The Batman', year: 2022, genre: 'Action', rating: '7.8', runtime: '176 min', poster: '74xTEgt7R36Fpooo50r9T25onhq.jpg', backdrop: 'b0PlSFdDwbyK0cf5RxwDpaRJ8SA.jpg', desc: 'Batman ventures into Gotham City’s underworld when a sadistic killer leaves behind a trail of cryptic clues.' },
  { id: 6, title: 'Everything Everywhere All at Once', year: 2022, genre: 'Adventure', rating: '7.8', runtime: '139 min', poster: 'w3LcciG1gC9M8xE3F6n5QkJ3w0P.jpg', backdrop: '5J2v4gq4G2g2Y6v7qv5Y6p8g4yH.jpg', desc: 'An exhausted laundromat owner becomes the unlikely hero who must connect with versions of herself across the multiverse.' },
  { id: 7, title: 'Barbie', year: 2023, genre: 'Comedy', rating: '6.9', runtime: '114 min', poster: 'iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', backdrop: 'NLS4x3l5J6Y3M5xJ6F1k4t5n6XU.jpg', desc: 'Barbie and Ken discover the joys and challenges of life outside the perfect world of Barbie Land.' },
  { id: 8, title: 'Top Gun: Maverick', year: 2022, genre: 'Action', rating: '8.2', runtime: '130 min', poster: '62HCnUTziyWcpDaBO2i1DX17ljH.jpg', backdrop: 'odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg', desc: 'After decades of service, Maverick trains a new generation of pilots for a mission unlike any other.' },
  { id: 9, title: 'Joker', year: 2019, genre: 'Drama', rating: '8.2', runtime: '122 min', poster: 'udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', backdrop: 'n6bUevtUqjJ5D6K6T2Y4y9q4u6H.jpg', desc: 'A struggling comedian descends into madness and becomes the symbol of a city’s growing unrest.' },
  { id: 10, title: 'Avatar: The Way of Water', year: 2022, genre: 'Adventure', rating: '7.6', runtime: '192 min', poster: 't6HIqrRAclMCA60NsSmeqe9RmNV.jpg', backdrop: '8rpDcsfLJypbO6vREc0547VKqEv.jpg', desc: 'Jake Sully and Neytiri must protect their family as a familiar threat returns to Pandora.' },
  { id: 11, title: 'The Super Mario Bros. Movie', year: 2023, genre: 'Animation', rating: '7.0', runtime: '92 min', poster: 'qNBAXBIQjnxw4g8j8e6YJ2x5f5T.jpg', backdrop: '9n2tJBplPbgR2ca05hS5CKXwP2c.jpg', desc: 'Mario and Luigi are transported to a magical world and pulled into an adventure to save a kingdom.' },
  { id: 12, title: 'The Fall Guy', year: 2024, genre: 'Action', rating: '7.0', runtime: '126 min', poster: 'tSz1qsmSJon0rqjHBxXG5R6g9b.jpg', backdrop: 'H5HjE7Xb9N6x5xq7b4Q0z4z2K3.jpg', desc: 'A stuntman gets pulled into a missing-star mystery while trying to win back the love of his life.' },
  { id: 13, title: 'Inside Out 2', year: 2024, genre: 'Animation', rating: '7.6', runtime: '96 min', poster: 'vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', backdrop: 'stKGOm8UyhuLPR9sZLjs5AkmncA.jpg', desc: 'Riley’s emotions face a new challenge when unexpected feelings arrive during her teenage years.' },
  { id: 14, title: 'The Lord of the Rings', year: 2001, genre: 'Fantasy', rating: '8.9', runtime: '178 min', poster: '6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', backdrop: 'x2RS3uTcsJJ9IfjNPcgDmCPU3UM.jpg', desc: 'A humble hobbit begins a perilous journey to destroy a powerful ring and save Middle-earth.' },
  { id: 15, title: 'John Wick: Chapter 4', year: 2023, genre: 'Action', rating: '7.7', runtime: '169 min', poster: 'vZloFAK7NmvMGKE7VkF5Utanq5l.jpg', backdrop: 'h8gHn0OzSqac7NiVoY4DcuZibR3.jpg', desc: 'John Wick uncovers a path to defeating the High Table, but must face a powerful new enemy.' },
  { id: 16, title: 'The Grand Budapest Hotel', year: 2014, genre: 'Comedy', rating: '8.1', runtime: '99 min', poster: 'eWdyYQreja6JGCzqHWXpWHDrrPo.jpg', backdrop: 'mzzqV6q4h0Y2WqJ6Jv0j7p4yq5X.jpg', desc: 'A legendary concierge and his young protégé become caught up in a battle over a priceless painting.' },
];
const genres = ['All', 'Action', 'Adventure', 'Sci-Fi', 'Drama', 'Comedy', 'Animation', 'Fantasy'];
const posterUrl = (path) => `${IMG}w500/${path}`;
const backdropUrl = (path) => `${IMG}w1280/${path}`;

function MovieCard({ movie, saved, onOpen, onToggle }) {
  return <article className="movie-card">
    <button className="poster-button" onClick={() => onOpen(movie)} aria-label={`More about ${movie.title}`}>
      <img className="poster" src={posterUrl(movie.poster)} alt={`${movie.title} poster`} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.classList.add('poster-fallback'); }} />
      <span className="poster-fallback-title">{movie.title}</span>
      <span className="poster-shade" />
      <span className="poster-play">▶</span>
    </button>
    <button className={`save-btn ${saved ? 'is-saved' : ''}`} onClick={() => onToggle(movie.id)} aria-label={saved ? 'Remove from My List' : 'Add to My List'}>{saved ? '♥' : '＋'}</button>
    <div className="movie-meta"><div className="movie-title" title={movie.title}>{movie.title}</div><div className="movie-sub"><span>★ {movie.rating}</span><span>{movie.year}</span><span>{movie.genre}</span></div></div>
  </article>;
}

export default function App() {
  const [route, setRoute] = useState(location.hash.replace('#/', '') || 'browse');
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem('cineva-list') || '[]'); } catch { return []; } });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onHash = () => { setRoute(location.hash.replace('#/', '') || 'browse'); setSelected(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('hashchange', onHash); window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('scroll', onScroll); };
  }, []);
  useEffect(() => { try { localStorage.setItem('cineva-list', JSON.stringify(saved)); } catch {} }, [saved]);
  useEffect(() => { const onKey = (e) => { if (e.key === 'Escape') setSelected(null); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, []);

  const toggleSaved = (id) => setSaved((old) => old.includes(id) ? old.filter((x) => x !== id) : [...old, id]);
  const filtered = useMemo(() => movies.filter((m) => (route !== 'mylist' || saved.includes(m.id)) && (genre === 'All' || m.genre === genre) && `${m.title} ${m.genre} ${m.year}`.toLowerCase().includes(query.toLowerCase().trim())), [route, saved, genre, query]);
  const featured = movies[0];
  const sections = route === 'mylist' ? [{ title: 'YOUR WATCHLIST', items: filtered }] : query.trim() || genre !== 'All' ? [{ title: query.trim() ? 'SEARCH RESULTS' : `${genre.toUpperCase()} MOVIES`, items: filtered }] : [
    { title: 'TRENDING THIS WEEK', items: movies.slice(0, 8) },
    { title: 'ADVENTURE & ACTION', items: movies.filter((m) => ['Action', 'Adventure'].includes(m.genre)) },
    { title: 'SCI-FI WORLDS', items: movies.filter((m) => m.genre === 'Sci-Fi') },
    { title: 'GOOD VIBES ONLY', items: movies.filter((m) => ['Comedy', 'Animation'].includes(m.genre)) },
    { title: 'CRITIC FAVOURITES', items: [...movies].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 6) },
  ];

  return <div className="app-shell">
    <header className={`navbar ${scrolled ? 'navbar-solid' : ''}`}>
      <a className="brand" href="#/browse" aria-label="Cineva home"><span className="brand-mark">C</span>CINEVA<span className="brand-dot">.</span></a>
      <nav className="nav-links"><a className={route !== 'mylist' ? 'active' : ''} href="#/browse">Discover</a><a className={route === 'mylist' ? 'active' : ''} href="#/mylist">My List <span className="list-count">{saved.length}</span></a></nav>
      <label className="search-box"><span>⌕</span><input value={query} onChange={(e) => { setQuery(e.target.value); if (route === 'mylist') location.hash = '#/browse'; }} placeholder="Search movies..." aria-label="Search movies" /><kbd>⌘ K</kbd></label>
      <div className="profile-chip">C</div>
    </header>

    {route !== 'mylist' && !query.trim() && genre === 'All' && <section className="hero" style={{ '--hero-image': `url("${backdropUrl(featured.backdrop)}")` }}>
      <div className="hero-overlay" />
      <div className="hero-content"><div className="eyebrow"><span className="eyebrow-line" /> CINEVA SPOTLIGHT <span className="eyebrow-year">2024</span></div><div className="hero-kicker">THE CINEMA EXPERIENCE</div><h1>DUNE <em>PART TWO</em></h1><p className="hero-description">Destiny is written in the sand. Step into an epic world of power, prophecy, and survival.</p><div className="hero-facts"><span className="rating-pill">★ 8.5</span><span>2024</span><span>166 min</span><span className="genre-pill">SCI-FI</span></div><div className="hero-actions"><button className="primary-btn" onClick={() => setSelected(featured)}>▶ &nbsp; Explore movie</button><button className="secondary-btn" onClick={() => toggleSaved(featured.id)}>{saved.includes(featured.id) ? '♥  In My List' : '＋  Add to My List'}</button></div></div>
      <div className="hero-side-note"><span>01</span><i /> 16 CURATED STORIES</div><div className="hero-bottom-fade" />
    </section>}

    <main className="content-area">
      <div className="section-intro"><div><p className="section-overline">YOUR NEXT OBSESSION STARTS HERE</p><h2>{route === 'mylist' ? 'My List' : query.trim() ? 'Find your next film' : 'Explore the collection'}</h2></div><div className="collection-count">{filtered.length.toString().padStart(2, '0')} <span>TITLES</span></div></div>
      {route !== 'mylist' && <div className="genre-bar" aria-label="Filter by genre">{genres.map((g) => <button key={g} className={genre === g ? 'genre-chip selected' : 'genre-chip'} onClick={() => setGenre(g)}>{g}</button>)}</div>}
      {sections.map((section) => <section className="movie-section" key={section.title}><div className="row-heading"><h3>{section.title}</h3><span className="row-rule" /><span className="row-number">{String(section.items.length).padStart(2, '0')}</span></div>{section.items.length ? <div className="movie-grid">{section.items.map((movie) => <MovieCard key={movie.id} movie={movie} saved={saved.includes(movie.id)} onOpen={setSelected} onToggle={toggleSaved} />)}</div> : <div className="empty-state"><span className="empty-icon">✦</span><h3>{route === 'mylist' ? 'Your list is waiting.' : 'No movies found.'}</h3><p>{route === 'mylist' ? 'Save films you love and they’ll be collected here.' : 'Try another title or choose a different genre.'}</p>{route === 'mylist' && <a className="primary-btn inline-btn" href="#/browse">Explore movies</a>}</div>}</section>)}
      <footer className="footer"><a className="brand" href="#/browse"><span className="brand-mark">C</span>CINEVA<span className="brand-dot">.</span></a><p>Stories worth staying in for.</p><span>© 2026 CINEVA · MADE FOR MOVIE LOVERS</span></footer>
    </main>

    {selected && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}><section className="detail-modal" role="dialog" aria-modal="true" aria-label={selected.title}><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close details">×</button><div className="detail-backdrop" style={{ backgroundImage: `linear-gradient(0deg,#11131b 0%,rgba(17,19,27,.18) 100%),url("${backdropUrl(selected.backdrop)}")` }} /><div className="detail-body"><div className="detail-poster-wrap"><img src={posterUrl(selected.poster)} alt={`${selected.title} poster`} /></div><div className="detail-copy"><p className="section-overline">CINEVA MOVIE GUIDE</p><h2>{selected.title}</h2><div className="hero-facts"><span className="rating-pill">★ {selected.rating}</span><span>{selected.year}</span><span>{selected.runtime}</span><span className="genre-pill">{selected.genre}</span></div><p>{selected.desc}</p><div className="hero-actions"><button className="primary-btn" onClick={() => alert('Trailer playback is not connected yet. Add a licensed trailer/video URL to enable playback.')}>▶ &nbsp; Watch trailer</button><button className="secondary-btn" onClick={() => toggleSaved(selected.id)}>{saved.includes(selected.id) ? '♥  In My List' : '＋  Add to My List'}</button></div><p className="disclaimer">Trailer playback requires a licensed video source. Movie artwork is loaded from TMDB image servers.</p></div></div></section></div>}
  </div>;
}
