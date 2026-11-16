/* CINEVA cinematic effects — vanilla JS, no npm packages required */
(() => {
  const movies = [
    { title: "Dune: Part Two", poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg" },
    { title: "Interstellar", poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
    { title: "The Batman", poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
    { title: "Spider-Man: Across the Spider-Verse", poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xjla8T.jpg" },
    { title: "Oppenheimer", poster: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJित1ZbV6KO2.jpg" },
    { title: "Joker", poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg" },
    { title: "Avatar: The Way of Water", poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg" },
    { title: "Everything Everywhere All at Once", poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWDrhP1AM.jpg" },
    { title: "Top Gun: Maverick", poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg" },
    { title: "The Grand Budapest Hotel", poster: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHwJwB8z3q8.jpg" }
  ];

  const root = document.createElement("div");
  root.id = "cineva-effects-root";
  root.innerHTML = `
    <button class="cineva-menu-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
    <div class="cineva-menu-scrim"></div>
    <nav class="cineva-side-menu" aria-label="Main navigation">
      <div class="cineva-brand">C I N E V A</div>
      <a href="#cineva-home">Home</a><a href="#cineva-movies">Movies</a>
      <a href="#cineva-gallery">Gallery</a><a href="#cineva-lanyard">About</a>
    </nav>
    <section class="cineva-drift-wall" id="cineva-home">
      <div class="cineva-drift-track" aria-hidden="true"></div>
      <div class="cineva-drift-content"><p>Stories that stay with you</p><h1>ENTER THE<br>WORLD OF CINEMA</h1></div>
    </section>
    <nav class="cineva-flow-menu" aria-label="Movie sections">
      <a href="#cineva-home">Discover</a><a href="#cineva-movies">Now Showing</a>
      <a href="#cineva-gallery">Movie Gallery</a><a href="#cineva-lanyard">Cineva Club</a>
    </nav>
    <section class="cineva-gallery" id="cineva-gallery">
      <div class="cineva-gallery-head"><div><p style="color:#e7b65c;letter-spacing:.2em;font-size:11px">CURATED FOR YOU</p><h2>Featured Movies</h2></div><span style="color:#aaa">Select a poster to explore</span></div>
      <div class="cineva-gallery-grid" id="cineva-movies"></div>
    </section>
    <section class="cineva-lanyard" id="cineva-lanyard">
      <div class="cineva-lanyard-card"><div class="cineva-lanyard-cord"></div>
        <div class="cineva-lanyard-badge"><strong>CINEVA</strong><span>THE MOVIE<br>CLUB</span><small>PASS · 2026</small></div>
      </div>
    </section>
    <div class="cineva-lightbox" role="dialog" aria-modal="true" aria-label="Movie poster">
      <button aria-label="Close poster">×</button><img alt="Selected movie poster">
    </div>`;
  document.body.appendChild(root);

  const drift = root.querySelector(".cineva-drift-track");
  for (let c = 0; c < 5; c++) {
    const col = document.createElement("div");
    col.className = "cineva-drift-column";
    [...movies, ...movies].slice(c, c + 8).forEach(movie => {
      const img = document.createElement("img"); img.src = movie.poster; img.alt = ""; img.loading = "lazy"; col.appendChild(img);
    });
    drift.appendChild(col);
  }

  const grid = root.querySelector(".cineva-gallery-grid");
  movies.forEach(movie => {
    const card = document.createElement("button");
    card.className = "cineva-poster"; card.type = "button";
    card.innerHTML = `<img loading="lazy" alt=""><span></span>`;
    card.querySelector("img").src = movie.poster;
    card.querySelector("img").alt = movie.title;
    card.querySelector("span").textContent = movie.title;
    card.addEventListener("click", () => {
      const fly = document.createElement("img"); fly.className = "cineva-flying-poster";
      fly.src = movie.poster;
      const rect = card.getBoundingClientRect();
      fly.style.left = `${rect.left + rect.width / 2 - 55}px`;
      fly.style.top = `${rect.top + rect.height / 2 - 82}px`;
      fly.style.setProperty("--fly-x", `${window.innerWidth / 2 - rect.left - rect.width / 2}px`);
      fly.style.setProperty("--fly-y", `${window.innerHeight / 2 - rect.top - rect.height / 2}px`);
      fly.style.setProperty("--fly-r", `${Math.random() * 18 - 9}deg`);
      document.body.appendChild(fly);
      setTimeout(() => fly.remove(), 1250);
      const box = root.querySelector(".cineva-lightbox");
      box.querySelector("img").src = movie.poster;
      box.querySelector("img").alt = movie.title;
      setTimeout(() => box.classList.add("is-open"), 160);
    });
    grid.appendChild(card);
  });

  const toggle = root.querySelector(".cineva-menu-toggle");
  const menu = root.querySelector(".cineva-side-menu");
  const scrim = root.querySelector(".cineva-menu-scrim");
  const closeMenu = () => { menu.classList.remove("is-open"); scrim.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open); scrim.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open)); toggle.textContent = open ? "×" : "☰";
  });
  scrim.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  const lightbox = root.querySelector(".cineva-lightbox");
  lightbox.querySelector("button").addEventListener("click", () => lightbox.classList.remove("is-open"));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.classList.remove("is-open"); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeMenu(); lightbox.classList.remove("is-open"); } });
})();
