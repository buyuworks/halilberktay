"use client";

import { useEffect, useState } from "react";
import type { ArchiveEntry } from "@/lib/content";

let cache: ArchiveEntry[] | null = null;
let pending: Promise<ArchiveEntry[]> | null = null;

export function loadArchiveIndex(): Promise<ArchiveEntry[]> {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetch("/arama-dizini.json")
      .then((r) => {
        if (!r.ok) throw new Error(`arama dizini: ${r.status}`);
        return r.json() as Promise<ArchiveEntry[]>;
      })
      .then((d) => (cache = d))
      .catch((err) => {
        pending = null; // bir sonraki denemede tekrar dene
        throw err;
      });
  }
  return pending;
}

/** Birleşik arşiv dizinini istemcide bir kez indirir ve paylaşır. `enabled` false iken indirmez. */
export function useArchiveIndex(enabled = true) {
  const [data, setData] = useState<ArchiveEntry[] | null>(cache);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!enabled || data) return;
    let alive = true;
    loadArchiveIndex()
      .then((d) => alive && setData(d))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [enabled, data]);
  return { entries: data, error };
}
