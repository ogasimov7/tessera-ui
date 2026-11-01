import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-24">
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-site-accent">404</p>
      <h1 className="text-5xl font-medium tracking-tighter">Page not found</h1>
      <Button asChild variant="outline" className="rounded-full"><Link href="/docs">Go to the docs</Link></Button>
    </div>
  );
}
