import { useState } from "react";
import {
  AnyfamilyProvider,
  useAnyamount,
  useAnyaround,
  useAnyfamily,
  useAnylocale,
  useAnymany,
  useAnyplural,
  useAnywhen,
  useAnywordCount,
  useAnywordTruncate,
} from "anyfamily-react";

const LOCALES = ["en-US", "de-DE", "ru-RU", "ja-JP", "ar-EG", "hi-IN"];

// Fixed once, so "x seconds ago" visibly ticks up while the page is open.
const OPENED_AT = Date.now() - 45_000;

export function App() {
  const [locale, setLocale] = useState("en-US");

  return (
    // One locale and one currency for every hook below; a hook's own options still win.
    <AnyfamilyProvider locale={locale} defaults={{ anyamount: { mode: "currency", currency: "EUR" } }}>
      <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui" }}>
        <h1>anyfamily-react</h1>
        <label>
          locale{" "}
          <select value={locale} onChange={(e) => setLocale(e.target.value)}>
            {LOCALES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
        <Order />
        <Composer />
      </main>
    </AnyfamilyProvider>
  );
}

function Order() {
  const placed = useAnywhen(OPENED_AT, { mode: "relative", numeric: true, refresh: 1_000 });
  const total = useAnyamount(1999.5); // currency comes from the provider's defaults
  const size = useAnyamount(3.2, { mode: "unit", unit: "gigabyte" });
  const items = useAnymany(["keyboard", "mouse", "monitor"]);
  const count = useAnyplural(3, { one: "item", other: "items" });
  const shipTo = useAnyaround("JP", { display: "flag-name" });
  const { direction, weekStart } = useAnylocale();

  return (
    <section dir={direction}>
      <h2>order</h2>
      <p>placed {placed}</p>
      <p>
        {count}: {items}
      </p>
      <p>total {total} · download {size}</p>
      <p>ship to {shipTo}</p>
      <p>
        text runs {direction}, week starts on day {weekStart}
      </p>
    </section>
  );
}

function Composer() {
  const [text, setText] = useState("Shipped today 👨‍👩‍👧 thanks!");
  const chars = useAnywordCount(text, { by: "grapheme" });
  const preview = useAnywordTruncate(text, 16, { ellipsis: "…" });
  // Everything bound to the provider, for calls a one-value hook does not cover.
  const { anywhen } = useAnyfamily();

  return (
    <section>
      <h2>composer</h2>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} style={{ width: "100%" }} />
      <p>
        {chars} characters (text.length says {text.length})
      </p>
      <p>preview: {preview}</p>
      <button onClick={() => alert(anywhen(Date.now(), { mode: "absolute" }))}>stamp</button>
    </section>
  );
}
