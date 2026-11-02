"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("hb-theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  }

  return (
    <button
      onClick={toggle}
      className="h-9 w-9 grid place-items-center rounded-full text-ink-soft hover:text-ink hover:bg-paper-sunk transition-colors"
      aria-label={dark ? "Aydınlık okuma moduna geç" : "Karanlık okuma moduna geç"}
      title={dark ? "Aydınlık mod" : "Karanlık okuma modu"}
    >
      {dark ? <Sun size={17} strokeWidth={1.75} /> : <Moon size={17} strokeWidth={1.75} />}
    </button>
  );
}
