/**
 * The docs page's "Limitations" list. Lives outside the client module so the
 * server-rendered page can also emit it as FAQPage structured data.
 */
export const LIMITATIONS: { title: string; body: string }[] = [
  {
    title: "It adds no behaviour",
    body: "Every formatting rule, option and edge case lives in the package the name comes from. When output looks wrong, the answer is in that package's reference — this layer only forwards.",
  },
  {
    title: "One extra name to keep current",
    body: "A caret range means core fixes reach you without a meta release, but a brand-new export needs the meta republished before you can import it from here. Reach for the package directly if you need something the day it ships.",
  },
  {
    title: "Eight packages still land in node_modules",
    body: "Tree-shaking is about what reaches your bundle, not about what npm installs. On disk the meta costs the same as installing all eight, because that is what it does.",
  },
  {
    title: "No React here",
    body: "These are plain functions, safe in a server component, a script or a worker. Hooks, the shared locale provider and the self-ticking relative time live in anyfamily-react.",
  },
];
