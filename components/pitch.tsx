import { STACKBLITZ, type Pkg } from "@/lib/packages";
import { PITCH } from "@/lib/pitch";

/**
 * The package in thirty seconds, under the demo. Collapsed for people —
 * the demo is the point of the page — but fully present in the HTML, so an
 * agent handed the URL gets what the package is, why, how to call it and
 * what it is not for, without a second request. The Markdown twin is
 * `/<id>/llms.txt`, linked from the footer and as the page's alternate.
 */
export function PackagePitch({ pkg }: { pkg: Pkg }) {
  const pitch = PITCH[pkg.id];
  return (
    <details className="group w-full max-w-2xl rounded-xl border border-white/[0.07] bg-black/30 px-5 py-3 text-sm text-white/55 open:pb-5">
      <summary className="cursor-pointer list-none font-mono text-[11px] tracking-[0.22em] text-white/30 uppercase transition-colors hover:text-white/60">
        <span className="mr-2 inline-block transition-transform group-open:rotate-90">▸</span>
        about {pkg.id}
      </summary>
      <section aria-label={`about ${pkg.id}`} className="mt-4 flex flex-col gap-4">
        <p className="text-white/75">{pitch.does}</p>
        <dl className="grid gap-x-4 gap-y-1 font-mono text-xs sm:grid-cols-[auto_1fr]">
          <dt className="text-white/30">wraps</dt>
          <dd>{pitch.wraps}</dd>
          <dt className="text-white/30">install</dt>
          <dd>npm install {pkg.id}</dd>
          <dt className="text-white/30">runtime</dt>
          <dd>{pitch.runtime}</dd>
          <dt className="text-white/30">docs</dt>
          <dd>
            <a href={`/docs/${pkg.id}`} className="underline decoration-white/20 hover:text-white/80">
              anyfamily.site/docs/{pkg.id}
            </a>
          </dd>
          <dt className="text-white/30">playground</dt>
          <dd>
            <a
              href={STACKBLITZ.vanilla}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/20 hover:text-white/80"
            >
              run the family on StackBlitz
            </a>
          </dd>
        </dl>
        <div>
          <h2 className="font-mono text-[11px] tracking-[0.22em] text-white/30 uppercase">why</h2>
          <p className="mt-1">{pitch.why}</p>
        </div>
        <div>
          <h2 className="font-mono text-[11px] tracking-[0.22em] text-white/30 uppercase">usage</h2>
          <pre className="mt-1 overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-[12px] leading-relaxed text-white/70">
            <code>{pitch.usage}</code>
          </pre>
        </div>
        <div>
          <h2 className="font-mono text-[11px] tracking-[0.22em] text-white/30 uppercase">not for</h2>
          <p className="mt-1">{pitch.notFor}</p>
        </div>
      </section>
    </details>
  );
}
