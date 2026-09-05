"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { profile } from "@/data/profile";

const BASE_FONT = 16;
const MIN_FONT = 11.5;
const FADE_MS = 500;
const TYPE_MS = 48;
const SELECT_MS = 400;
const GAP_MS = 150;
const HOLD_MIN = 1200;
const TOTAL_CYCLE = 5600;

export function QuoteCarousel() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState("");
  const [selected, setSelected] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const quote = profile.quotes[index];
  const author = quote.author;

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) =>
      timeouts.push(setTimeout(fn, ms));

    const typingTotal = author.length * TYPE_MS;
    const fixed = FADE_MS + typingTotal + SELECT_MS + GAP_MS + FADE_MS;
    const hold = Math.max(HOLD_MIN, TOTAL_CYCLE - fixed);

    const startTyping = FADE_MS;
    const startSelect = startTyping + typingTotal + hold;
    const startClear = startSelect + SELECT_MS;
    const startFadeOut = startClear + GAP_MS;

    later(() => setVisible(true), 0);

    for (let i = 1; i <= author.length; i++) {
      later(
        () => setTyped(author.slice(0, i)),
        startTyping + i * TYPE_MS,
      );
    }

    later(() => setSelected(true), startSelect);
    later(() => {
      setSelected(false);
      setTyped("");
    }, startClear);
    later(() => {
      setVisible(false);
      later(
        () => setIndex((i) => (i + 1) % profile.quotes.length),
        FADE_MS,
      );
    }, startFadeOut);

    return () => timeouts.forEach(clearTimeout);
  }, [index, author]);

  useLayoutEffect(() => {
    const el = textRef.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const fit = () => {
      el.style.fontSize = `${BASE_FONT}px`;
      let size = BASE_FONT;
      while (el.scrollWidth > parent.clientWidth && size > MIN_FONT) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div className="mt-6 max-w-xl" aria-live="polite" aria-atomic>
      <p
        ref={textRef}
        className={`truncate whitespace-nowrap text-base italic leading-[26px] text-zinc-300 transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        “{quote.text}”
      </p>
      <p className="mt-2 h-5 font-mono text-xs font-bold uppercase tracking-widest text-zinc-400">
        —{" "}
        <span
          className={`-mx-0.5 rounded-sm px-0.5 text-zinc-300 transition-colors duration-150 ${
            selected ? "bg-sky-500/40" : "bg-transparent"
          }`}
        >
          {typed}
        </span>
        {typed !== author && !selected && (
          <span aria-hidden="true" className="animate-pulse">
            ▍
          </span>
        )}
      </p>
    </div>
  );
}