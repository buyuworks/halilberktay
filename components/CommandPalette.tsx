"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, CornerDownLeft, FileText, Headphones, CirclePlay, Radar, Search, Hash } from "lucide-react";
import type { ArchiveEntry } from "@/lib/content";
import type { ContentType } from "@/lib/types";
import { createSearcher } from "@/lib/search";
import { useArchiveIndex } from "@/lib/useArchiveIndex";
import { TOPICS } from "@/data/topics";
import { Highlight } from "@/components/Highlight";
import { cx, formatDateShort } from "@/lib/format";

export const TYPE_ICON: Record<ContentType, typeof FileText> = {
  Makale: FileText,
  Video: CirclePlay,
  "Ses Kaydı": Headphones,
  Kitap: BookOpen,
  Radar: Radar,
};

const FILTERS: ("Tümü" | ContentType)[] = ["Tümü", "Makale", "Video", "Ses Kaydı", "Kitap", "Radar"];

type Row =
  | { kind: "entry"; e: ArchiveEntry }
  | { kind: "link"; label: string; hint: string; href: string; icon: typeof FileText };

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof FILTERS)[number]>("Tümü");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Dizin ilk açılışta indirilir (tüm site için tek statik JSON)
  const [wanted, setWanted] = useState(false);
  const { entries, error } = useArchiveIndex(wanted);
  const index = useMemo(() => entries ?? [], [entries]);
  const search = useMemo(() => createSearcher(index, (t) => TOPICS[t as keyof typeof TOPICS]?.label ?? t), [index]);
  useEffect(() => {
    if (open) setWanted(true);
  }, [open]);

  // Kısayollar: ⌘K / Ctrl+K, "/" ve özel olay
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !open) {
        const t = e.target as HTMLElement;
        if (t.tagName !== "INPUT" && t.tagName !== "TEXTAREA" && !t.isContentEditable) {
          e.preventDefault();
          setOpen(true);
        }
      }
    }
    function onOpen(e: Event) {
      const d = (e as CustomEvent).detail;
      if (typeof d === "string") setQ(d);
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("hb:open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hb:open-search", onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.select());
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const all = useMemo(() => (q.trim() ? search(q) : []), [q, search]);
  const results = useMemo(
    () => (type === "Tümü" ? all : all.filter((e) => e.type === type)).slice(0, 40),
    [all, type],
  );
  const typeCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of all) c[e.type] = (c[e.type] ?? 0) + 1;
    return c;
  }, [all]);

  const quick: Row[] = useMemo(
    () => [
      { kind: "link", label: "Birleşik arşiv", hint: "Tüm içerik, çapraz filtreler", href: "/arsiv/", icon: Search },
      { kind: "link", label: "Son dizi: Ulusal Kurtuluş Savaşı mı, Milli Mücadele mi?", hint: "14 bölüm · 2026", href: "/yazilar/ulusal-kurtulus-savasi-mi-milli-mucadele-mi/", icon: FileText },
      { kind: "link", label: "Solun Kültür Serüveni", hint: "Video dizisi · Serbestiyet TV", href: "/videolar/?seri=solun-kultur-seruveni", icon: CirclePlay },
      { kind: "link", label: "Bibliyografya", hint: "1983'ten bugüne kitaplar", href: "/kitaplar/", icon: BookOpen },
      { kind: "link", label: "Entelektüel Radar", hint: "Bugünlerde masamda", href: "/radar/", icon: Radar },
      ...(["feodalizm-atut", "erken-cumhuriyet", "solun-tarihi", "devrimler"] as const).map(
        (t): Row => ({ kind: "link", label: TOPICS[t].label, hint: "Konu sayfası", href: `/konular/${t}/`, icon: Hash }),
      ),
    ],
    [],
  );

  const rows: Row[] = q.trim() ? results.map((e) => ({ kind: "entry", e })) : quick;

  useEffect(() => setActive(0), [q, type]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = useCallback(
    (row: Row, newTab = false) => {
      const href = row.kind === "entry" ? row.e.href : row.href;
      setOpen(false);
      if (newTab) window.open(href, "_blank");
      else router.push(href);
    },
    [router],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (rows[active]) go(rows[active], e.metaKey || e.ctrlKey);
      else if (q.trim()) {
        setOpen(false);
        router.push(`/arsiv/?q=${encodeURIComponent(q)}`);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const i = FILTERS.indexOf(type);
      setType(FILTERS[(i + (e.shiftKey ? FILTERS.length - 1 : 1)) % FILTERS.length]);
    }
  }

  if (!open) return null;

  // Sonuçları türe göre grupla (sıra korunur)
  let lastType = "";

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Arşivde ara">
      <div className="absolute inset-0 bg-ink/30 dark:bg-black/60 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
      <div className="relative mx-auto mt-[8vh] w-[min(46rem,calc(100%-1.5rem))] bg-paper-raised border border-rule shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] animate-fade-up flex flex-col max-h-[80vh]">
        <div className="flex items-center gap-3 px-5 border-b border-rule">
          <Search size={18} className="text-ink-mute shrink-0" strokeWidth={1.75} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Başlık, konu, mecra, yıl… (örn. feodalizm, Taraf, 1991)"
            className="flex-1 h-16 bg-transparent outline-none font-display text-xl placeholder:text-ink-mute/70"
            aria-controls="hb-search-results"
            aria-activedescendant={rows[active] ? `hb-row-${active}` : undefined}
            role="combobox"
            aria-expanded="true"
          />
          <kbd className="meta border border-rule rounded px-1.5 py-0.5 text-[0.65rem]">esc</kbd>
        </div>

        <div className="flex gap-1 px-4 py-2 border-b border-rule overflow-x-auto scrollbar-none" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={type === f}
              onClick={() => {
                setType(f);
                inputRef.current?.focus();
              }}
              className={cx(
                "kicker px-2.5 py-1.5 rounded-full whitespace-nowrap transition-colors",
                type === f ? "bg-ink text-paper" : "text-ink-mute hover:text-ink",
              )}
            >
              {f}
              {q.trim() && f !== "Tümü" && (
                <span className="ml-1 opacity-60">{typeCounts[f] ?? 0}</span>
              )}
            </button>
          ))}
        </div>

        <div ref={listRef} id="hb-search-results" role="listbox" className="overflow-y-auto overscroll-contain py-2">
          {!q.trim() && <p className="kicker text-ink-mute px-5 pt-2 pb-1">Hızlı erişim</p>}
          {q.trim() && !entries && (
            <p className="px-5 py-10 text-center text-sm text-ink-mute" role="status">
              {error ? "Arama dizini yüklenemedi. Bağlantınızı kontrol edip yeniden deneyin." : "Arşiv dizini yükleniyor…"}
            </p>
          )}
          {q.trim() && entries && rows.length === 0 && (
            <div className="px-5 py-10 text-center">
              <p className="font-display text-xl">&ldquo;{q}&rdquo; için sonuç bulunamadı.</p>
              <p className="text-sm text-ink-mute mt-2">Daha kısa bir ifade deneyin ya da filtreyi &ldquo;Tümü&rdquo;ye alın.</p>
            </div>
          )}
          {rows.map((row, i) => {
            const isActive = i === active;
            if (row.kind === "link") {
              const Icon = row.icon;
              return (
                <button
                  key={row.href + i}
                  id={`hb-row-${i}`}
                  data-idx={i}
                  role="option"
                  aria-selected={isActive}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(row)}
                  className={cx("w-full flex items-center gap-3 px-5 py-2.5 text-left", isActive && "bg-paper-sunk")}
                >
                  <Icon size={16} strokeWidth={1.6} className="text-ink-mute shrink-0" />
                  <span className="flex-1 truncate">{row.label}</span>
                  <span className="meta">{row.hint}</span>
                </button>
              );
            }
            const e = row.e;
            const Icon = TYPE_ICON[e.type];
            const header = e.type !== lastType ? e.type : null;
            lastType = e.type;
            return (
              <div key={e.id}>
                {header && type === "Tümü" && <p className="kicker text-ink-mute px-5 pt-3 pb-1">{header}</p>}
                <button
                  id={`hb-row-${i}`}
                  data-idx={i}
                  role="option"
                  aria-selected={isActive}
                  onMouseMove={() => setActive(i)}
                  onClick={(ev) => go(row, ev.metaKey || ev.ctrlKey)}
                  className={cx(
                    "w-full flex gap-3 px-5 py-3 text-left border-l-2",
                    isActive ? "bg-paper-sunk border-accent" : "border-transparent",
                  )}
                >
                  <Icon size={16} strokeWidth={1.6} className="text-ink-mute shrink-0 mt-1" />
                  <span className="flex-1 min-w-0">
                    <span className="block font-display text-[1.08rem] leading-snug">
                      <Highlight text={e.title} query={q} />
                    </span>
                    <span className="block text-sm text-ink-soft line-clamp-1 mt-0.5">
                      <Highlight text={e.summary} query={q} />
                    </span>
                    <span className="meta block mt-1">
                      {e.source}
                      {e.part ? ` · Bölüm ${e.partLabel ?? e.part}` : ""} · {formatDateShort(e.date, e.datePrecision)}
                    </span>
                  </span>
                  {isActive && <CornerDownLeft size={14} className="text-ink-mute mt-1.5 shrink-0" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-2.5 border-t border-rule meta">
          <span className="hidden sm:flex gap-3">
            <span>↑↓ gezin</span>
            <span>↵ aç</span>
            <span>⇥ tür değiştir</span>
          </span>
          {q.trim() ? (
            <button
              className="flex items-center gap-1.5 text-accent hover:underline"
              onClick={() => {
                setOpen(false);
                router.push(`/arsiv/?q=${encodeURIComponent(q)}${type !== "Tümü" ? `&tur=${encodeURIComponent(type)}` : ""}`);
              }}
            >
              Tüm sonuçları filtrelerle aç <ArrowRight size={13} />
            </button>
          ) : (
            <span>{entries ? `${index.length} kayıt aranabilir` : "Dizin yükleniyor…"}</span>
          )}
        </div>
      </div>
    </div>
  );
}
