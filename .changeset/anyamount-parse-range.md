---
"anyamount": minor
---

- **`anyamount.parse(text, { locale })`** — the other direction: `"1.999,00"` in German is `1999`, `"1 234,5"` in French is `1234.5`, Arabic-Indic digits count too. Separators and digits are read off `Intl`, whatever wraps the number (currency, `%`, whitespace) is ignored, a minus on either side or accounting parentheses negates, and anything that is not a number is `NaN` — never a throw. One rule beyond the locale: a lone separator followed by one or two digits is a decimal point (`"1.5"` in a German form is one and a half).
- **`anyamount.range(from, to, options)`** — two numbers as one range, shared parts collapsed (`"€10.00 – 20.00"`, `"1–2.5 kg"`), same options as the plain call. Falls back to two formats joined with an en dash where `Intl.NumberFormat.formatRange` is missing (Node 18).
- **`compact` option** (smart mode) — `true` compacts from zero for counters and badges (`"1.2K"`), `false` never compacts, a number sets the threshold. The default stays `10000`.
