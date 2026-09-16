import { useEffect, useState, type RefObject } from "react";

import type { Preset } from "./presets";

const TYPE_MS = 42;
const HOLD_MS = 2600;

/**
 * The timing behind <CodeAnimation>: types the current preset's call out one
 * character at a time, holds, moves to the next, and drives the countdown fill
 * of the active dot. Everything waits until the demo is mounted and on screen.
 *
 * A pick (a click on a dot) pauses autoplay; picking the active dot again
 * resumes it from the start of that preset.
 *
 * `ref` is the element whose visibility gates the animation. It is passed in
 * rather than created here so the returned state holds no ref: React's
 * compiler lint would otherwise treat every field read in render as a ref read.
 */
export function useCodeCycle(presets: Preset[], ref: RefObject<HTMLElement | null>) {
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [i, setI] = useState(0);
  const [len, setLen] = useState(0);
  const [done, setDone] = useState(false);
  const [fill, setFill] = useState(0);
  const [paused, setPaused] = useState(false);
  // Bumped on resume so the typewriter restarts even though `i` did not change.
  const [run, setRun] = useState(0);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration gate
  useEffect(() => setMounted(true), []);

  // Only animate while the demo is actually visible.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  const preset = presets[i];
  const call = preset.call;

  // Type the current call out.
  useEffect(() => {
    if (!mounted || !inView) return;
    // Reset the typewriter when the preset changes; timers drive the rest.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLen(0);
    setDone(false);
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setLen(n);
      if (n >= call.length) {
        clearInterval(id);
        setDone(true);
      }
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [mounted, inView, i, call, run]);

  // Advance to the next preset after a hold.
  useEffect(() => {
    if (!done || !inView || paused) return;
    const id = setTimeout(() => setI((p) => (p + 1) % presets.length), HOLD_MS);
    return () => clearTimeout(id);
  }, [done, inView, paused, presets.length]);

  // Drive the active dot's progress bar across the whole cycle: type the call
  // out (≈ call.length · TYPE_MS) then hold (HOLD_MS). Reset to 0, then flip to
  // 100 on the next frame so the CSS width transition actually fires.
  const cycleMs = call.length * TYPE_MS + HOLD_MS;
  useEffect(() => {
    if (!mounted || !inView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFill(0);
      return;
    }
    // Paused: the active dot sits full and still — nothing is counting down.
    if (paused) {
      setFill(100);
      return;
    }
    setFill(0);
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setFill(100));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [mounted, inView, i, call, paused, run]);

  function pick(k: number) {
    if (k === i && paused) {
      setPaused(false);
      setRun((r) => r + 1);
      return;
    }
    setPaused(true);
    setI(k);
  }

  return {
    mounted,
    index: i,
    preset,
    // Before mount the whole call renders, so the server HTML is complete.
    typed: mounted ? call.slice(0, len) : call,
    done,
    fill,
    cycleMs,
    paused,
    pick,
  };
}
