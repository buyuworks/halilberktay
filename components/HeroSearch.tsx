"use client";

import { Search } from "lucide-react";
import { openSearch } from "@/lib/nav";
import { loadArchiveIndex } from "@/lib/useArchiveIndex";
import { useEffect, useState } from "react";

const SUGGESTIONS = ["Feodalizm", "Köprülü", "Fransız Devrimi", "Taraf", "Milli Mücadele", "Nâzım"];

export function HeroSearch() {
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);
  return (
    <div>
      <button
        onClick={() => openSearch()}
        onPointerEnter={() => void loadArchiveIndex().catch(() => {})}
        onFocus={() => void loadArchiveIndex().catch(() => {})}
        className="group w-full flex items-center gap-4 h-16 px-5 bg-paper-raised border border-rule hover:border-ink-mute transition-colors text-left shadow-[0_1px_0_rgba(0,0,0,0.03)]"
      >
        <Search size={20} strokeWidth={1.6} className="text-ink-mute" />
        <span className="flex-1 font-display text-xl text-ink-mute truncate"><span className="hidden sm:inline">Yarım asırlık arşivde arayın…</span><span className="sm:hidden">Arşivde arayın…</span></span>
        <kbd className="hidden sm:inline meta border border-rule rounded px-2 py-0.5">{mac ? "⌘" : "Ctrl"} K</kbd>
      </button>
      <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-2">
        <span className="meta mr-2">Sık arananlar:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => openSearch(s)}
            className="text-sm px-2.5 py-0.5 text-ink-soft hover:text-accent border-b border-dotted border-ink-mute/50 hover:border-accent"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
