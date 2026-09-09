/**
 * The docs page's "Limitations" list. Lives outside the client module so the
 * server-rendered page can also emit it as FAQPage structured data.
 */
export const LIMITATIONS: { title: string; body: string }[] = [
  {
    title: "Client components only",
    body: "The package is a client module — every export sits behind \"use client\". Hooks need state and effects, so a React Server Component cannot call them. Format on the server with the plain functions from anyfamily instead; they are the same code without the React layer.",
  },
  {
    title: "The provider is a context, not a store",
    body: "Changing its locale re-renders every hook underneath it, the same as any other context. Put it high in the tree and change it rarely — a locale that flips on every keystroke re-renders the subtree on every keystroke.",
  },
  {
    title: "The tick is a poll, not a scheduler",
    body: "useAnywhen re-renders on a fixed interval rather than on unit boundaries, so a transition like \"59 seconds ago\" to \"1 minute ago\" can lag up to one tick behind. Pass an explicit refresh where the alignment matters. Hooks with the same interval share one timer, so they re-render together.",
  },
  {
    title: "It adds hooks, not behaviour",
    body: "Every formatting rule, option and edge case lives in the underlying package. When output looks wrong, the answer is in that package's reference — this layer only supplies the locale and re-renders.",
  },
];
