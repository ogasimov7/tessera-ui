"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const KEY = "theme";
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function apply(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

/** Switches the site between light and dark. Until the visitor picks one, it follows the OS setting. */
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    // Keep following the OS while the visitor hasn't chosen.
    const mq = media();
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try { stored = localStorage.getItem(KEY); } catch {}
      if (stored) return;
      apply(e.matches);
      setDark(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    apply(next);
    setDark(next);
    try { localStorage.setItem(KEY, next ? "dark" : "light"); } catch {}
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}>
      {/* Both icons render until mounted so server and client markup match; CSS picks the visible one. */}
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
    </Button>
  );
}
