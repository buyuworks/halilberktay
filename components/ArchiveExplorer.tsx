"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ArchiveEntry } from "@/lib/content";
import type { ContentType, TopicId } from "@/lib/types";
import { TOPICS } from "@/data/topics";
import { useArchiveIndex } from "@/lib/useArchiveIndex";
import { createSearcher } from "@/lib/search";
import { ArchiveRow } from "@/components/EntryViews";
import { cx } from "@/lib/format";

/* ------------------------------------------------------------------
   BİRLEŞİK ARŞİV — ÇAPRAZ (FASETLİ) FİLTRELEME
   Her faset sayımı, o fasetin kendisi hariç diğer tüm filtreler
   uygulanarak hesaplanır: kullanıcı hiçbir zaman "0 sonuç" çıkmazına
   yönlendirilmez. Durum URL'de tutulur → paylaşılabilir arama.
------------------------------------------------------------------- */

const TYPES: ContentType[] = ["Makale", "Video", "Ses Kaydı", "Kitap", "Radar"];
const MIN_YEAR = 1980;
const MAX_YEAR = 2026;
type Sort = "yeni" | "eski" | "ilgi";

function parseList(v: string | null) {
  return v ? v.split(",").filter(Boolean) : [];
}

/** Dizini statik JSON'dan yükler; yüklenene kadar iskelet gösterir */
export function ArchiveExplorer() {
  const { entries, error } = useArchiveIndex();
  if (!entries)
    return (
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 py-16" role="status" aria-live="polite">
        <p className="meta">{error ? "Arşiv dizini yüklenemedi; sayfayı yenilemeyi deneyin." : "Arşiv dizini yükleniyor…"}</p>
        {!error && (
          <div className="mt-6 space-y-6 animate-pulse" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-12 gap-6 border-b border-rule pb-6">
                <div className="col-span-3 h-4 bg-paper-sunk" />
                <div className="col-span-9 space-y-2">
                  <div className="h-6 w-3/4 bg-paper-sunk" />
                  <div className="h-4 w-full bg-paper-sunk" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  return <ArchiveExplorerView entries={entries} />;
}

function ArchiveExplorerView({ entries }: { entries: ArchiveEntry[] }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [types, setTypes] = useState<string[]>(parseList(sp.get("tur")));
  const [sources, setSources] = useState<string[]>(parseList(sp.get("kaynak")));
  const [topics, setTopics] = useState<string[]>(parseList(sp.get("konu")));
  const [range, setRange] = useState<[number, number]>(() => {
    const y = sp.get("yil")?.split("-").map(Number);
    return y && y.length === 2 && !y.some(isNaN) ? [y[0], y[1]] : [MIN_YEAR, MAX_YEAR];
  });
  const [sort, setSort] = useState<Sort>((sp.get("sirala") as Sort) ?? (sp.get("q") ? "ilgi" : "yeni"));
  const [drawer, setDrawer] = useState(false);
  const [limit, setLimit] = useState(25);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useMemo(() => createSearcher(entries, (t) => TOPICS[t as TopicId]?.label ?? t), [entries]);

  // URL senkronizasyonu
  useEffect(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (types.length) p.set("tur", types.join(","));
    if (sources.length) p.set("kaynak", sources.join(","));
    if (topics.length) p.set("konu", topics.join(","));
    if (range[0] !== MIN_YEAR || range[1] !== MAX_YEAR) p.set("yil", `${range[0]}-${range[1]}`);
    if (sort !== (q.trim() ? "ilgi" : "yeni")) p.set("sirala", sort);
    const s = p.toString();
    router.replace(s ? `?${s}` : "?", { scroll: false });
    setLimit(25);
  }, [q, types, sources, topics, range, sort, router]);

  // q değişince sıralamayı akıllıca güncelle
  const prevQ = useRef(q);
  useEffect(() => {
    if (!prevQ.current.trim() && q.trim() && sort === "yeni") setSort("ilgi");
    if (prevQ.current.trim() && !q.trim() && sort === "ilgi") setSort("yeni");
    prevQ.current = q;
  }, [q, sort]);

  const base = useMemo(() => search(q), [search, q]);

  type Facet = "type" | "source" | "topic" | "year";
  const pass = (e: ArchiveEntry, skip?: Facet) =>
    (skip === "type" || !types.length || types.includes(e.type)) &&
    (skip === "source" || !sources.length || sources.includes(e.source)) &&
    (skip === "topic" || !topics.length || topics.some((t) => e.tags.includes(t as TopicId))) &&
    (skip === "year" || (e.year >= range[0] && e.year <= range[1]));

  const results = useMemo(() => {
    const r = base.filter((e) => pass(e));
    if (sort === "yeni") return [...r].sort((a, b) => b.date.localeCompare(a.date));
    if (sort === "eski") return [...r].sort((a, b) => a.date.localeCompare(b.date));
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, types, sources, topics, range, sort]);

  const facet = (skip: Facet) => base.filter((e) => pass(e, skip));
  const typeCounts = countBy(facet("type"), (e) => [e.type]);
  const sourceCounts = countBy(facet("source"), (e) => [e.source]);
  const topicCounts = countBy(facet("topic"), (e) => e.tags);
  const yearPool = facet("year");
  const yearCounts = countBy(yearPool, (e) => [String(e.year)]);
  const maxYear = Math.max(1, ...Object.values(yearCounts));

  const sourceList = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([s]) => s);
  const topicList = (Object.keys(TOPICS) as TopicId[]).sort((a, b) => (topicCounts[b] ?? 0) - (topicCounts[a] ?? 0));

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const activePills: { label: string; clear: () => void }[] = [
    ...types.map((t) => ({ label: t, clear: () => toggle(types, setTypes, t) })),
    ...sources.map((s) => ({ label: s, clear: () => toggle(sources, setSources, s) })),
    ...topics.map((t) => ({ label: TOPICS[t as TopicId]?.label ?? t, clear: () => toggle(topics, setTopics, t) })),
    ...(range[0] !== MIN_YEAR || range[1] !== MAX_YEAR
      ? [{ label: `${range[0]}–${range[1]}`, clear: () => setRange([MIN_YEAR, MAX_YEAR]) }]
      : []),
  ];
  const clearAll = () => {
    setTypes([]);
    setSources([]);
    setTopics([]);
    setRange([MIN_YEAR, MAX_YEAR]);
  };

  const filters = (
    <div className="space-y-9">
      <FacetGroup title="İçerik türü">
        {TYPES.map((t) => (
          <Check key={t} label={t} count={typeCounts[t] ?? 0} checked={types.includes(t)} onChange={() => toggle(types, setTypes, t)} />
        ))}
      </FacetGroup>

      <FacetGroup title="Yıl aralığı">
        <YearHistogram counts={yearCounts} max={maxYear} range={range} setRange={setRange} />
      </FacetGroup>

      <FacetGroup title="Konu">
        <div className="flex flex-wrap gap-1.5">
          {topicList.map((t) => {
            const c = topicCounts[t] ?? 0;
            const on = topics.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggle(topics, setTopics, t)}
                disabled={!c && !on}
                aria-pressed={on}
                className={cx(
                  "text-[0.78rem] px-2.5 py-1 border rounded-full transition-colors disabled:opacity-35",
                  on ? "bg-ink text-paper border-ink" : "border-rule text-ink-soft hover:border-ink-mute",
                )}
              >
                {TOPICS[t].short ?? TOPICS[t].label} <span className="opacity-60 tabular-nums">{c}</span>
              </button>
            );
          })}
        </div>
      </FacetGroup>

      <FacetGroup title="Mecra · Dizi · Yayınevi">
        {sourceList.slice(0, 14).map((s) => (
          <Check key={s} label={s} count={sourceCounts[s] ?? 0} checked={sources.includes(s)} onChange={() => toggle(sources, setSources, s)} />
        ))}
        {sources
          .filter((s) => !sourceList.includes(s))
          .map((s) => (
            <Check key={s} label={s} count={0} checked onChange={() => toggle(sources, setSources, s)} />
          ))}
      </FacetGroup>
    </div>
  );

  // Yıl ayraçlı sonuç listesi
  let lastYear = 0;

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10">
      {/* Arama çubuğu */}
      <div className="sticky top-16 z-20 bg-paper pt-4 pb-4 border-b border-rule-strong">
        <div className="flex items-center gap-3">
          <label className="flex-1 flex items-center gap-3 h-14 px-4 bg-paper-raised border border-rule focus-within:border-ink">
            <Search size={20} strokeWidth={1.6} className="text-ink-mute" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Arşivde ara: başlık, konu, mecra, yıl…"
              className="flex-1 bg-transparent outline-none font-display text-xl placeholder:text-ink-mute/70 min-w-0"
              aria-label="Arşivde ara"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Aramayı temizle" className="text-ink-mute hover:text-ink">
                <X size={18} />
              </button>
            )}
          </label>
          <button
            className="lg:hidden h-14 px-4 border border-rule flex items-center gap-2"
            onClick={() => setDrawer(true)}
            aria-label="Filtreler"
          >
            <SlidersHorizontal size={18} />
            {activePills.length > 0 && <span className="meta">{activePills.length}</span>}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 min-h-7">
          <p className="meta mr-2" aria-live="polite">
            <span className="text-ink font-medium">{results.length}</span> kayıt
            {q.trim() && <> · &ldquo;{q.trim()}&rdquo;</>}
          </p>
          {activePills.map((p) => (
            <button
              key={p.label}
              onClick={p.clear}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-accent-soft text-accent-ink rounded-full hover:opacity-80"
            >
              {p.label} <X size={11} />
            </button>
          ))}
          {activePills.length > 0 && (
            <button onClick={clearAll} className="text-xs text-ink-mute underline underline-offset-2 hover:text-ink">
              Tümünü temizle
            </button>
          )}
          <label className="ml-auto meta flex items-center gap-2">
            Sırala
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="bg-transparent border border-rule rounded px-2 py-1 text-ink font-sans text-xs"
            >
              {q.trim() && <option value="ilgi">İlgi düzeyi</option>}
              <option value="yeni">Yeniden eskiye</option>
              <option value="eski">Eskiden yeniye</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 pt-8">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-[13.5rem] max-h-[calc(100dvh-15rem)] overflow-y-auto pr-2 pb-10 scrollbar-none">{filters}</div>
        </aside>

        <section className="lg:col-span-9" aria-label="Sonuçlar">
          {results.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-3xl">Bu ölçütlerle eşleşen kayıt yok.</p>
              <p className="mt-3 text-ink-soft">Filtrelerden birini kaldırmayı ya da daha genel bir ifade kullanmayı deneyin.</p>
              <button onClick={clearAll} className="mt-6 text-accent underline underline-offset-4">
                Filtreleri temizle
              </button>
            </div>
          ) : (
            <>
              {results.slice(0, limit).map((e) => {
                const showYear = sort !== "ilgi" && e.year !== lastYear;
                lastYear = e.year;
                return (
                  <div key={e.id}>
                    {showYear && (
                      <div className="flex items-baseline gap-4 pt-8 first:pt-0">
                        <span className="font-display text-5xl text-ink/15 dark:text-ink/20 tabular-nums leading-none">{e.year}</span>
                        <span className="flex-1 border-t border-rule" />
                      </div>
                    )}
                    <ArchiveRow e={e} query={q} />
                  </div>
                );
              })}
              {results.length > limit && (
                <button
                  onClick={() => setLimit((l) => l + 25)}
                  className="mt-10 w-full py-4 border border-rule hover:border-ink-mute text-ink-soft hover:text-ink"
                >
                  Daha fazla göster ({results.length - limit} kayıt daha)
                </button>
              )}
            </>
          )}
        </section>
      </div>

      {/* Mobil filtre çekmecesi */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtreler">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 right-0 w-[min(24rem,90vw)] bg-paper p-6 overflow-y-auto animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <p className="font-display text-2xl">Filtreler</p>
              <button onClick={() => setDrawer(false)} aria-label="Kapat">
                <X size={22} />
              </button>
            </div>
            {filters}
            <button onClick={() => setDrawer(false)} className="mt-8 w-full py-3 bg-ink text-paper">
              {results.length} sonucu göster
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function countBy(list: ArchiveEntry[], key: (e: ArchiveEntry) => string[]) {
  const m: Record<string, number> = {};
  for (const e of list) for (const k of key(e)) m[k] = (m[k] ?? 0) + 1;
  return m;
}

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="kicker text-ink-mute mb-3 pb-2 border-b border-rule w-full">{title}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function Check({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) {
  return (
    <label className={cx("flex items-center gap-2.5 py-1 cursor-pointer group", !count && !checked && "opacity-40")}>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" disabled={!count && !checked} />
      <span
        className={cx(
          "h-3.5 w-3.5 border grid place-items-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent",
          checked ? "bg-accent border-accent" : "border-ink-mute group-hover:border-ink",
        )}
      >
        {checked && (
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-paper">
            <path d="M1.5 5.2 4 7.5 8.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        )}
      </span>
      <span className="flex-1 text-[0.92rem] truncate">{label}</span>
      <span className="meta tabular-nums">{count}</span>
    </label>
  );
}

function YearHistogram({
  counts,
  max,
  range,
  setRange,
}: {
  counts: Record<string, number>;
  max: number;
  range: [number, number];
  setRange: (r: [number, number]) => void;
}) {
  const years = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);
  const decades = [1980, 1990, 2000, 2010, 2020];
  return (
    <div>
      <div className="flex items-end gap-px h-16" aria-hidden>
        {years.map((y) => {
          const c = counts[y] ?? 0;
          const inRange = y >= range[0] && y <= range[1];
          return (
            <button
              key={y}
              tabIndex={-1}
              title={`${y}: ${c} kayıt`}
              onClick={() => setRange(range[0] === y && range[1] === y ? [MIN_YEAR, MAX_YEAR] : [y, y])}
              className="flex-1 h-full flex items-end group"
            >
              <span
                className={cx(
                  "w-full transition-colors",
                  inRange ? "bg-accent group-hover:bg-accent-ink" : "bg-rule group-hover:bg-ink-mute",
                )}
                style={{ height: c ? `${Math.max(8, (c / max) * 100)}%` : "2px" }}
              />
            </button>
          );
        })}
      </div>
      <div className="relative h-5 -mt-1">
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          value={range[0]}
          onChange={(e) => setRange([Math.min(+e.target.value, range[1]), range[1]])}
          className="range-thumb absolute inset-0 w-full"
          aria-label="Başlangıç yılı"
        />
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          value={range[1]}
          onChange={(e) => setRange([range[0], Math.max(+e.target.value, range[0])])}
          className="range-thumb absolute inset-0 w-full"
          aria-label="Bitiş yılı"
        />
      </div>
      <div className="flex justify-between meta">
        <span className="text-ink">{range[0]}</span>
        <span className="text-ink">{range[1]}</span>
      </div>
      <div className="flex flex-wrap gap-1 mt-3">
        {decades.map((d) => (
          <button
            key={d}
            onClick={() => setRange([d, Math.min(d + 9, MAX_YEAR)])}
            className={cx(
              "meta px-1.5 py-0.5 border rounded",
              range[0] === d && range[1] === Math.min(d + 9, MAX_YEAR) ? "border-accent !text-accent" : "border-rule hover:border-ink-mute",
            )}
          >
            {String(d).slice(2)}&apos;ler
          </button>
        ))}
      </div>
    </div>
  );
}
