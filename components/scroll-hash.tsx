"use client";

import { useEffect } from "react";

/**
 * Keeps the address bar in step with the section in view, and puts the reader
 * back where they were when they return to the page.
 *
 * The landing scrolls inside `<main>` rather than down the document, so the
 * browser has no document scroll to restore: leaving for a docs page and
 * pressing back would otherwise always land at the top of the tour. Writing the
 * section into the URL as it passes gives that history entry somewhere to
 * return to, and makes a link copied mid-page point at the section on screen.
 *
 * `replaceState`, never `pushState` — pushing would stack one entry per section
 * and back would crawl the page section by section instead of leaving it.
 */
export function ScrollHash({ ids }: { ids: string[] }) {
  // A string, so an inline array literal doesn't re-run the effect every render.
  const key = ids.join(",");

  // Restore first, once, before the observer starts writing.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id || !key.split(",").includes(id)) return;
    // Instant, not smooth: this is where the reader already was, not a journey.
    document.getElementById(id)?.scrollIntoView({ behavior: "auto" });
    // Mount only. A hash that changes later is the reader navigating, and
    // scrolling them again would fight it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sectionIds = key.split(",");
    const [first] = sectionIds;
    let current = window.location.hash.slice(1);

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit || hit.target.id === current) return;
        current = hit.target.id;
        // The opening section is the page itself — leave its URL bare, so a
        // link shared from the top is `/` rather than `/#main`.
        const url =
          current === first
            ? window.location.pathname + window.location.search
            : `#${current}`;
        // Carry the existing state object: Next keeps its router tree in there,
        // and dropping it breaks client navigation out of the page.
        window.history.replaceState(window.history.state, "", url);
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [key]);

  return null;
}
