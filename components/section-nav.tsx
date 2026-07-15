"use client";

import { useEffect, useState } from "react";

export type NavItem = { id: string; label: string; accent: string };

/**
 * Desktop-only scroll-spy rail: one dot per section, active one highlighted,
 * label reveals on hover. Clicking jumps via the anchor href.
 */
export function SectionNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    const els = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed top-1/2 right-6 z-20 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-label={item.label}
            className="group flex items-center gap-2"
          >
            <span
              className="font-mono text-[10px] tracking-wide whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ color: item.accent }}
            >
              {item.label}
            </span>
            <span
              className="h-2 w-2 rounded-full border transition-transform duration-200"
              style={{
                borderColor: item.accent,
                background: isActive ? item.accent : "transparent",
                transform: isActive ? "scale(1.3)" : "scale(1)",
              }}
            />
          </a>
        );
      })}
    </nav>
  );
}
