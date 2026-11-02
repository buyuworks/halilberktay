"use client";

import Link from "next/link";
import { useState } from "react";
import type { TimelineEvent } from "@/lib/types";
import { cx } from "@/lib/format";

export type TLItem = TimelineEvent & { href?: string };

const KINDS: TimelineEvent["kind"][] = ["Eğitim", "Akademi", "Yayın", "Kamusal", "Burs"];
const KIND_STYLE: Record<TimelineEvent["kind"], string> = {
  Eğitim: "bg-navy",
  Akademi: "bg-accent",
  Yayın: "bg-ink",
  Kamusal: "bg-[#b58a3c]",
  Burs: "bg-ink-mute",
};

export function Timeline({ items }: { items: TLItem[] }) {
  const [on, setOn] = useState<Set<string>>(new Set(KINDS));
  const list = items.filter((i) => on.has(i.kind));
  const toggle = (k: string) => {
    const n = new Set(on);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    setOn(n.size ? n : new Set(KINDS));
  };
  let lastDecade = 0;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10" aria-label="Olay türü">
        {KINDS.map((k) => (
          <button
            key={k}
            onClick={() => toggle(k)}
            aria-pressed={on.has(k)}
            className={cx(
              "inline-flex items-center gap-2 text-sm px-3 py-1 border rounded-full transition-opacity",
              on.has(k) ? "border-ink-mute" : "border-rule opacity-45",
            )}
          >
            <span className={cx("h-2 w-2 rounded-full", KIND_STYLE[k])} />
            {k}
          </button>
        ))}
      </div>

      <ol className="relative">
        <span className="absolute left-[5.5rem] sm:left-[7.5rem] top-2 bottom-2 w-px bg-rule" aria-hidden />
        {list.map((e, i) => {
          const decade = Math.floor(e.year / 10) * 10;
          const showDecade = decade !== lastDecade;
          lastDecade = decade;
          return (
            <li key={e.title + i}>
              {showDecade && (
                <p aria-hidden className="relative font-display text-[3.5rem] sm:text-[5rem] leading-none text-ink/10 dark:text-ink/15 mt-10 mb-4 first:mt-0 select-none tabular-nums">
                  {decade}&apos;ler
                </p>
              )}
              <div className="relative grid grid-cols-[5.5rem_1fr] sm:grid-cols-[7.5rem_1fr] gap-x-6 pb-8 group">
                <p className="font-mono text-sm text-ink-soft text-right pr-6 pt-0.5 tabular-nums">
                  {e.year}
                  {e.endYear && <span className="block text-ink-mute">– {e.endYear}</span>}
                </p>
                <span
                  className={cx(
                    "absolute left-[5.5rem] sm:left-[7.5rem] top-1.5 -translate-x-1/2 h-3 w-3 rounded-full ring-4 ring-paper",
                    KIND_STYLE[e.kind],
                  )}
                  aria-hidden
                />
                <div className="pl-2">
                  <p className="kicker text-ink-mute">
                    {e.kind}
                    {e.place ? ` · ${e.place}` : ""}
                  </p>
                  {e.href ? (
                    <Link href={e.href} className="font-display text-[1.45rem] leading-snug mt-1 block link-underline w-fit">
                      {e.title}
                    </Link>
                  ) : (
                    <p className="font-display text-[1.45rem] leading-snug mt-1">{e.title}</p>
                  )}
                  {e.detail && <p className="font-serif text-ink-soft mt-1.5 leading-relaxed max-w-2xl">{e.detail}</p>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
