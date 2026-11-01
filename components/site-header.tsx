"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GUIDES = ["/docs", "/docs/installation", "/docs/theming", "/docs/ai-systems"];
const NAV = [
  { href: "/docs", label: "Docs", match: (p: string) => GUIDES.includes(p) },
  { href: "/docs/button", label: "Components", match: (p: string) => p.startsWith("/docs/") && !GUIDES.includes(p) },
  { href: "/themes", label: "Themes", match: (p: string) => p.startsWith("/themes") },
  { href: "/generate", label: "Generate", ai: true, match: (p: string) => p.startsWith("/generate") },
];

export function SiteHeader() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--grid-line)] bg-background/90 backdrop-blur">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-[15px] font-semibold tracking-tight">
          <span aria-hidden className="grid size-[22px] grid-cols-2 gap-[2px]">
            <i className="rounded-[2px] bg-foreground" />
            <i className="rounded-[2px_2px_2px_9px] bg-site-accent" />
            <i className="rounded-[9px_2px_2px_2px] bg-site-accent" />
            <i className="rounded-[2px] bg-foreground" />
          </span>
          <span className="hidden sm:inline">tessera</span>
        </Link>
        <nav className="ml-auto flex min-w-0 items-center gap-1 overflow-x-auto">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={n.match(path) ? "page" : undefined}
              className={cn("flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm text-foreground/75 hover:text-foreground", n.match(path) && "text-site-accent hover:text-site-accent")}>
              {n.label}
              {n.ai && <span className="rounded-full border border-site-accent/40 px-1.5 font-mono text-[10px] font-semibold text-site-accent">AI</span>}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden rounded-full px-4 sm:inline-flex"><Link href="/generate">Get Tessera</Link></Button>
        </div>
      </div>
    </header>
  );
}
