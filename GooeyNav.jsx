import { useEffect, useRef, useState } from "react";
import "./GooeyNav.css";

const DEFAULT_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Movies", href: "#movies" },
  { label: "Series", href: "#series" },
  { label: "About", href: "#about" }
];

export default function GooeyNav({
  items = DEFAULT_ITEMS,
  initialActiveIndex = 0,
  activeIndex,
  onChange,
  className = "",
  theme = "dark"
}) {
  const [internalIndex, setInternalIndex] = useState(initialActiveIndex);
  const current = activeIndex ?? internalIndex;
  const listRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector(`[data-index="${current}"]`);
    if (!active) return;
    setPill({ left: active.offsetLeft, width: active.offsetWidth });
  }, [current, items]);

  const choose = (index, item) => {
    if (activeIndex === undefined) setInternalIndex(index);
    onChange?.(index, item);
  };

  return (
    <nav className={`gooey-nav ${theme === "light" ? "gooey-nav--light" : ""} ${className}`}>
      <ul className="gooey-nav__list" ref={listRef}>
        <span
          className="gooey-nav__pill"
          style={{ transform: `translateX(${pill.left}px)`, width: pill.width }}
          aria-hidden="true"
        />
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            <a
              href={item.href || "#"}
              data-index={index}
              className={index === current ? "is-active" : ""}
              aria-current={index === current ? "page" : undefined}
              onClick={(event) => {
                if (!item.href || item.href === "#") event.preventDefault();
                choose(index, item);
              }}
            >
              {item.icon && <span className="gooey-nav__icon">{item.icon}</span>}
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
