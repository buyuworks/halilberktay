"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Minus, Plus, Printer } from "lucide-react";
import { cx } from "@/lib/format";

/* Okuma ilerleme çubuğu: sayfanın üst kenarında ince kiremit çizgi */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight * 0.6;
        setP(Math.min(1, Math.max(0, -r.top / Math.max(total, 1))));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [targetId]);
  return (
    <div className="fixed top-0 inset-x-0 z-50 h-[3px] pointer-events-none" aria-hidden>
      <div className="h-full bg-accent origin-left transition-transform duration-150" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}

const SCALES = [0.88, 1, 1.12, 1.25, 1.4];

/* Yazı boyutu, bağlantı kopyalama, yazdırma */
export function ReaderControls({ className }: { className?: string }) {
  const [i, setI] = useState(1);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    try {
      const s = parseFloat(localStorage.getItem("hb-reader-scale") ?? "1");
      const k = SCALES.indexOf(s);
      if (k >= 0) setI(k);
    } catch {}
  }, []);
  function set(k: number) {
    const n = Math.max(0, Math.min(SCALES.length - 1, k));
    setI(n);
    document.documentElement.style.setProperty("--reader-scale", String(SCALES[n]));
    try {
      localStorage.setItem("hb-reader-scale", String(SCALES[n]));
    } catch {}
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }
  const btn = "h-9 w-9 grid place-items-center rounded-full text-ink-soft hover:text-ink hover:bg-paper-sunk disabled:opacity-30 transition-colors";
  return (
    <div className={cx("flex items-center gap-1", className)}>
      <span className="meta mr-1 hidden sm:inline">Yazı boyutu</span>
      <button className={btn} onClick={() => set(i - 1)} disabled={i === 0} aria-label="Yazıyı küçült">
        <Minus size={15} />
      </button>
      <span className="font-display text-lg w-8 text-center select-none" aria-live="polite" aria-label={`Yazı boyutu ${Math.round(SCALES[i] * 100)}%`}>
        <span style={{ fontSize: `${0.7 + i * 0.12}rem` }}>A</span>
      </span>
      <button className={btn} onClick={() => set(i + 1)} disabled={i === SCALES.length - 1} aria-label="Yazıyı büyüt">
        <Plus size={15} />
      </button>
      <span className="w-px h-5 bg-rule mx-1.5" />
      <button className={btn} onClick={copy} aria-label="Bağlantıyı kopyala" title="Bağlantıyı kopyala">
        {copied ? <Check size={15} className="text-accent" /> : <Link2 size={15} />}
      </button>
      <button className={btn} onClick={() => window.print()} aria-label="Yazdır" title="Yazdır">
        <Printer size={15} />
      </button>
    </div>
  );
}

/* İçindekiler: görünür bölümü vurgular */
export function TableOfContents({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => {
        const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (v[0]) setActive(v[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);
  if (!items.length) return null;
  return (
    <nav aria-label="İçindekiler">
      <p className="kicker text-ink-mute mb-3">İçindekiler</p>
      <ol className="space-y-2 border-l border-rule">
        {items.map((it, n) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={cx(
                "block -ml-px pl-4 border-l text-sm leading-snug transition-colors",
                active === it.id ? "border-accent text-ink" : "border-transparent text-ink-mute hover:text-ink",
              )}
            >
              <span className="font-mono text-[0.7rem] mr-1.5">{String(n + 1).padStart(2, "0")}</span>
              {it.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CopyCitation({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 1600);
        } catch {}
      }}
      className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline underline-offset-4"
    >
      {ok ? <Check size={14} /> : null}
      {ok ? "Kopyalandı" : "Atfı kopyala"}
    </button>
  );
}
