"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// One pass over the source: comments, strings, keywords, JSX/HTML tag names, CSS custom properties and hex colors.
const TOKENS = /(\/\*[\s\S]*?\*\/|(?<![:\w])\/\/[^\n]*|^[ \t]*#[ \t][^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`[^`]*`)|\b(import|from|export|function|return|const|let|default|async|await|npx|npm)\b|(<\/?[A-Za-z][\w.]*)|(--[\w-]+)|(#[0-9a-fA-F]{6}\b)/gm;
const CLASSES = ["text-muted-foreground italic", "text-chart-2", "text-chart-5", "text-chart-1", "text-chart-1", "text-chart-3"];

function highlight(code: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of code.matchAll(TOKENS)) {
    const group = m.slice(1).findIndex((g) => g !== undefined);
    out.push(code.slice(last, m.index));
    out.push(<span key={m.index} className={CLASSES[group]}>{m[0]}</span>);
    last = m.index! + m[0].length;
  }
  out.push(code.slice(last));
  return out;
}

/** A dark code window (it uses the system's own dark tokens, in either site theme). */
export function CodeBlock({ name, code, copyable = true, className }: { name: string; code: string; copyable?: boolean; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={cn("dark min-w-0 overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-black/10 dark:ring-white/10", className)}>
      <div className="flex items-center justify-between gap-2 border-b py-1.5 pl-4 pr-1.5 font-mono text-xs text-muted-foreground">
        <span>{name}</span>
        {copyable && (
          <Button variant="ghost" size="icon" className="size-7" aria-label={`Copy ${name}`}
            onClick={() => navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })}>
            {copied ? <Check /> : <Copy />}
          </Button>
        )}
      </div>
      <pre className="max-h-[460px] overflow-auto bg-background/60 p-4 font-mono text-[12.8px] leading-relaxed"><code>{highlight(code)}</code></pre>
    </div>
  );
}
