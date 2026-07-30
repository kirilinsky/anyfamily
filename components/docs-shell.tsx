"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";

export type DocsNavItem = { id: string; label: string };

/**
 * Theme variables for the docs routes. Set as inline style on the shell's root
 * rather than on `document.documentElement` (which the standalone demo sites
 * did) — scoping them means nothing leaks onto the landing page when the user
 * navigates back client-side, and no effect is needed to apply them.
 */
const THEMES = {
  dark: {
    "--bg": "#0a0a0a",
    "--bg-secondary": "#111111",
    "--text-primary": "rgba(255,255,255,0.88)",
    "--text-secondary": "rgba(255,255,255,0.55)",
    "--text-muted": "rgba(255,255,255,0.3)",
    "--border": "rgba(255,255,255,0.07)",
    "--nav-active": "rgba(255,255,255,0.06)",
    "--code-bg": "rgba(0,0,0,0.6)",
    "--code-border": "rgba(255,255,255,0.08)",
    "--code-text": "#a1a1aa",
    "--sky": "#38bdf8",
    "--emerald": "#34d399",
    "--amber": "#fbbf24",
    "--violet": "#c4b5fd",
    "--table-alt": "rgba(255,255,255,0.02)",
  },
  light: {
    "--bg": "#ffffff",
    "--bg-secondary": "#f8f8f7",
    "--text-primary": "#111111",
    "--text-secondary": "#555555",
    "--text-muted": "#999999",
    "--border": "rgba(0,0,0,0.08)",
    "--nav-active": "rgba(0,0,0,0.05)",
    "--code-bg": "#f4f4f5",
    "--code-border": "rgba(0,0,0,0.08)",
    "--code-text": "#3f3f46",
    "--sky": "#0369a1",
    "--emerald": "#059669",
    "--amber": "#b45309",
    "--violet": "#6d28d9",
    "--table-alt": "rgba(0,0,0,0.02)",
  },
} satisfies Record<string, Record<string, string>>;

export function Code({ children }: { children: string }) {
  return (
    <pre
      style={{ background: "var(--code-bg)", borderColor: "var(--code-border)" }}
      className="overflow-x-auto rounded-xl border p-4 font-mono text-sm leading-relaxed"
    >
      <code style={{ color: "var(--code-text)" }}>{children}</code>
    </pre>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-8">
      <h2
        style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
        className="mb-6 border-b pb-3 text-xl font-medium"
      >
        {title}
      </h2>
      <div
        className="space-y-6 text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {children}
      </div>
    </section>
  );
}

export function Prop({
  name,
  type,
  def,
  desc,
}: {
  name: string;
  type: string;
  def?: string;
  desc: string;
}) {
  return (
    <div
      style={{ borderColor: "var(--border)" }}
      className="flex flex-col gap-1 border-b py-3 last:border-0"
    >
      <div className="flex flex-wrap items-center gap-3">
        <code style={{ color: "var(--doc-accent)" }} className="font-mono text-sm">
          {name}
        </code>
        <code style={{ color: "var(--sky)" }} className="font-mono text-xs">
          {type}
        </code>
        {def && (
          <span style={{ color: "var(--text-muted)" }} className="text-xs">
            default: <code className="font-mono">{def}</code>
          </span>
        )}
      </div>
      <p style={{ color: "var(--text-muted)" }} className="text-sm">
        {desc}
      </p>
    </div>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return (
    <code style={{ color: "var(--emerald)" }} className="font-mono">
      {children}
    </code>
  );
}

/** Zebra-striped rows, used for the granularity / compatibility style tables. */
export function Rows({ children }: { children: ReactNode[] }) {
  return (
    <div
      style={{ borderColor: "var(--border)" }}
      className="overflow-hidden rounded-xl border"
    >
      {children.map((row, i) => (
        <div
          key={i}
          style={{ background: i % 2 === 0 ? "var(--table-alt)" : "transparent" }}
        >
          {row}
        </div>
      ))}
    </div>
  );
}

export function DocsShell({
  pkgId,
  nav,
  accentDark,
  accentLight,
  children,
}: {
  pkgId: string;
  nav: DocsNavItem[];
  /** Docs accent on the dark theme — normally the package's family color. */
  accentDark: string;
  /** Darker variant readable on white; the family color rarely is. */
  accentLight: string;
  children: ReactNode;
}) {
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState(nav[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    nav.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [nav]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const theme = {
    ...(dark ? THEMES.dark : THEMES.light),
    "--doc-accent": dark ? accentDark : accentLight,
  } as CSSProperties;

  return (
    <div
      style={{
        ...theme,
        background: "var(--bg)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        transition: "background .2s, color .2s",
      }}
    >
      <header
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
        className="fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm"
      >
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 px-6">
          <div className="flex shrink-0 items-center gap-6">
            <Link
              href={`/${pkgId}`}
              style={{ color: "var(--text-muted)" }}
              className="cursor-pointer font-mono text-sm transition-opacity hover:opacity-80"
            >
              ← {pkgId}
            </Link>
            <span
              style={{ color: "var(--text-muted)" }}
              className="hidden text-xs tracking-widest uppercase sm:inline"
            >
              docs
            </span>
          </div>
          <select
            value={active}
            onChange={(e) => scrollTo(e.target.value)}
            aria-label="Jump to section"
            style={{
              color: "var(--text-secondary)",
              background: "var(--bg-secondary)",
              borderColor: "var(--border)",
            }}
            className="min-w-0 flex-1 cursor-pointer rounded-md border px-2 py-1 font-mono text-xs outline-none md:hidden"
          >
            {nav.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setDark((d) => !d)}
            style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
            className="shrink-0 cursor-pointer rounded-md border px-3 py-1 font-mono text-xs transition-opacity hover:opacity-80"
          >
            {dark ? "☀ light" : "☾ dark"}
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-12 px-6 pt-20">
        <aside className="sticky top-20 hidden w-44 shrink-0 self-start md:block">
          <nav className="flex flex-col gap-0.5">
            {nav.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="cursor-pointer rounded-lg px-3 py-1.5 text-left font-mono text-sm transition-colors"
                style={{
                  color: active === id ? "var(--text-primary)" : "var(--text-muted)",
                  background: active === id ? "var(--nav-active)" : "transparent",
                }}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 pb-32">
          <h1 className="sr-only">{pkgId} API reference</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
