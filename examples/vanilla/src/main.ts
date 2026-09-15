import { anyamount, anyaround, anylocale, anylong, anymany, anyplural, anyword, anywhen } from "anyfamily";

const select = document.querySelector<HTMLSelectElement>("#locale")!;
const table = document.querySelector<HTMLTableElement>("#out")!;

const HOUR = 3_600_000;

// Each row is [call as written, result]. Change the calls — the page reloads.
function rows(locale: string): [string, unknown][] {
  const now = Date.now();
  return [
    ['anywhen(yesterday)', anywhen(now - 26 * HOUR, { locale })],
    ['anywhen(3h ago, { mode: "relative" })', anywhen(now - 3 * HOUR, { mode: "relative", locale })],
    ['anywhen.range(Sep 12, Sep 15)', anywhen.range(new Date(2026, 8, 12), new Date(2026, 8, 15), { locale, format: { day: "numeric", month: "short" } })],

    ["anyamount(1234567)", anyamount(1234567, { locale })],
    ['anyamount(1999, { mode: "currency", currency: "EUR" })', anyamount(1999, { mode: "currency", currency: "EUR", locale })],
    ['anyamount(3.2, { mode: "unit", unit: "gigabyte" })', anyamount(3.2, { mode: "unit", unit: "gigabyte", locale })],
    ['anyamount.parse("1.999,50", { locale: "de" })', anyamount.parse("1.999,50", { locale: "de" })],

    ['anymany(["apple", "banana", "cherry"])', anymany(["apple", "banana", "cherry"], { locale })],
    ['anymany(["S", "M", "L"], { type: "disjunction" })', anymany(["S", "M", "L"], { type: "disjunction", locale })],

    ['anyaround("JP", { display: "flag-name" })', anyaround("JP", { display: "flag-name", locale })],
    ['anyaround("EUR")', anyaround("EUR", { locale })],

    ["anylong(9_000_000)", anylong.supported ? anylong(9_000_000, { locale }) : "Intl.DurationFormat missing here"],

    ['anyplural(5, { one: "item", other: "items" })', anyplural(5, { one: "item", other: "items" }, { locale })],
    ['anyplural(5, { one: "год", few: "года", many: "лет" }, { locale: "ru" })', anyplural(5, { one: "год", few: "года", many: "лет" }, { locale: "ru" })],
    ['anyplural(3, …, { type: "ordinal" })', anyplural(3, { one: "st", two: "nd", few: "rd", other: "th" }, { type: "ordinal", locale: "en" })],

    ['anyword.count("👨‍👩‍👧 hi", { by: "grapheme" })', anyword.count("👨‍👩‍👧 hi", { by: "grapheme" })],
    ['anyword.truncate("héllo 👨‍👩‍👧 world", 7, { ellipsis: "…" })', anyword.truncate("héllo 👨‍👩‍👧 world", 7, { ellipsis: "…" })],

    ["anylocale(locale).direction", anylocale.supported ? anylocale(locale).direction : "Intl Locale Info missing here"],
    ["anylocale(locale).weekStart", anylocale.supported ? anylocale(locale).weekStart : "—"],
  ];
}

function render() {
  const locale = select.value;
  table.replaceChildren(
    ...rows(locale).map(([call, result]) => {
      const tr = document.createElement("tr");
      const code = document.createElement("td");
      const value = document.createElement("td");
      code.textContent = call;
      value.textContent = typeof result === "string" ? result : JSON.stringify(result);
      tr.append(code, value);
      return tr;
    }),
  );
}

select.addEventListener("change", render);
render();
