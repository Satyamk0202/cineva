import { useEffect, useRef } from "react";
import "./FlyingPosters.css";

const demoItems = [
  { image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", title: "Oppenheimer" },
  { image: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", title: "Dune" },
  { image: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", title: "The Shawshank Redemption" },
  { image: "https://image.tmdb.org/t/p/w500/8Vt6mWERe矢.jpg", title: "Spider-Man" },
  { image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", title: "Joker" }
];

export default function FlyingPosters({
  items = demoItems,
  speed = 24,
  gap = 28,
  className = "",
  onItemClick
}) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame;
    let last = 0;
    let offset = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = (time) => {
      if (last && !reduced) {
        offset += ((time - last) / 1000) * speed;
        const half = track.scrollHeight / 2;
        if (half > 0 && offset >= half) offset = 0;
        track.style.transform = `translate3d(0, ${-offset}px, 0)`;
      }
      last = time;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [speed, items]);

  const posters = [...items, ...items];
  return (
    <div className={`flying-posters ${className}`}>
      <div className="flying-posters__track" ref={trackRef} style={{ gap }}>
        {posters.map((item, index) => {
          const data = typeof item === "string" ? { image: item, title: `Poster ${index + 1}` } : item;
          return (
            <button
              className="flying-posters__card"
              key={`${data.image}-${index}`}
              type="button"
              onClick={() => onItemClick?.(data, index % items.length)}
              aria-label={`View ${data.title || "movie poster"}`}
            >
              <img src={data.image} alt={data.title || "Movie poster"} loading="lazy" />
              {data.title && <span>{data.title}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
