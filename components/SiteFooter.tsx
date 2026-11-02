import Link from "next/link";
import { NAV } from "@/lib/nav";
import { TOPICS } from "@/data/topics";
import type { TopicId } from "@/lib/types";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule-strong bg-paper">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 py-14 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-4xl leading-none">Halil Berktay</p>
          <p className="mt-4 max-w-sm text-ink-soft font-serif leading-relaxed">
            Tarihçi ve yazar. Kitaplar, makaleler, köşe yazıları ve konuşma kayıtları.
          </p>
          <p className="meta mt-6">Prototip · Kasım 2026 · Veriler doğrulanmış kaynaklardan; yer tutucular işaretlidir.</p>
        </div>
        <div className="md:col-span-3">
          <p className="kicker text-ink-mute mb-4">Bölümler</p>
          <ul className="space-y-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="kicker text-ink-mute mb-4">Konular</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-soft">
            {(Object.keys(TOPICS) as TopicId[]).map((t) => (
              <li key={t}>
                <Link href={`/konular/${t}/`} className="link-underline hover:text-ink">
                  {TOPICS[t].label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
