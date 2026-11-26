"use client";

import { Search } from "lucide-react";
import { openSearch } from "@/lib/nav";
import { loadArchiveIndex } from "@/lib/useArchiveIndex";

/* Hero içinde sade arama bağlantısı (büyük kutu yerine tek satır) */
export function HeroSearchLink({ onDark = false }: { onDark?: boolean }) {
  return (
    <button
      onClick={() => openSearch()}
      onPointerEnter={() => void loadArchiveIndex().catch(() => {})}
      onFocus={() => void loadArchiveIndex().catch(() => {})}
      className={`group inline-flex items-center gap-3 pb-1.5 border-b transition-colors ${
        onDark ? "border-[#ebe5d8]/30 hover:border-[#ebe5d8] text-[#ebe5d8]/80 hover:text-[#ebe5d8]" : "border-ink-mute/40 hover:border-ink text-ink-soft hover:text-ink"
      }`}
    >
      <Search size={17} strokeWidth={1.6} />
      <span className="font-display text-lg">Arşivde arayın</span>
    </button>
  );
}
