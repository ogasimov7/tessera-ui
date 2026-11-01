"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DemoTabs({ preview, code }: { preview: React.ReactNode; code: React.ReactNode }) {
  return (
    <Tabs defaultValue="preview" className="gap-0 overflow-hidden rounded-xl border border-[var(--grid-line)]">
      <div className="border-b border-[var(--grid-line)] bg-card p-2"><TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList></div>
      <TabsContent value="preview" className="flex min-h-64 items-center justify-center bg-[radial-gradient(var(--grid-line)_1px,transparent_1px)] bg-[length:14px_14px] px-6 py-12">{preview}</TabsContent>
      <TabsContent value="code" className="[&>div]:rounded-none [&>div]:ring-0">{code}</TabsContent>
    </Tabs>
  );
}
