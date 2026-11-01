import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: "Tessera UI", template: "%s · Tessera UI" },
  description: "Copy-paste React components on shadcn/ui conventions, plus AI-generated design systems with a Figma kit and code.",
};

// Runs before paint: the visitor's stored choice wins, otherwise the OS setting (see components/theme-toggle.tsx).
const themeScript = `(function(){var t=null;try{t=localStorage.getItem('theme')}catch(e){}var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="min-h-dvh">
        <SiteHeader />
        {/* Clips the full-bleed grid lines; on <body> the clip would propagate to the viewport and not apply. */}
        <div className="overflow-x-clip">
        <div className="site-frame min-h-[calc(100dvh-3.5rem)]">
          <div className="site-rail hatch" aria-hidden />
          <main className="flex min-w-0 flex-col px-2">
            <div className="flex-1 pb-24">{children}</div>
            <footer className="grid-row flex flex-wrap justify-between gap-2 py-6 font-mono text-xs text-muted-foreground">
              <span>Tessera UI · components on shadcn/ui conventions (MIT)</span>
              <span>Payments by Stripe</span>
            </footer>
          </main>
          <div className="site-rail hatch" aria-hidden />
        </div>
        </div>
      </body>
    </html>
  );
}
