"use client";

import { AlertCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CELLS: { id: string; name: string; demo: () => React.ReactNode }[] = [
  { id: "button", name: "Button", demo: () => <div className="flex flex-wrap justify-center gap-2"><Button size="sm">Primary</Button><Button size="sm" variant="outline">Outline</Button></div> },
  { id: "badge", name: "Badge", demo: () => <div className="flex flex-wrap justify-center gap-1.5"><Badge variant="success">Paid</Badge><Badge variant="warning">Pending</Badge><Badge variant="destructive">Failed</Badge></div> },
  { id: "input", name: "Input", demo: () => <Input placeholder="name@studio.az" aria-label="Email" className="max-w-56" /> },
  {
    id: "select", name: "Select", demo: () => (
      <Select defaultValue="team">
        <SelectTrigger className="w-44" aria-label="Plan"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="starter">Starter</SelectItem><SelectItem value="team">Team</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem></SelectContent>
      </Select>
    ),
  },
  { id: "checkbox", name: "Checkbox", demo: () => <div className="flex items-center gap-2"><Checkbox id="lc-terms" defaultChecked /><Label htmlFor="lc-terms">Accept terms</Label></div> },
  { id: "switch", name: "Switch", demo: () => <div className="flex items-center gap-2"><Switch id="lc-air" defaultChecked /><Label htmlFor="lc-air">Notifications</Label></div> },
  { id: "slider", name: "Slider", demo: () => <Slider defaultValue={[60]} max={100} aria-label="Volume" className="max-w-48" /> },
  { id: "progress", name: "Progress", demo: () => <Progress value={66} aria-label="Upload progress" className="max-w-48" /> },
  { id: "tabs", name: "Tabs", demo: () => <Tabs defaultValue="week"><TabsList><TabsTrigger value="day">Day</TabsTrigger><TabsTrigger value="week">Week</TabsTrigger><TabsTrigger value="month">Month</TabsTrigger></TabsList></Tabs> },
  { id: "avatar", name: "Avatar", demo: () => <div className="flex -space-x-2 *:ring-2 *:ring-background">{["SD", "JL", "IN", "+4"].map((a) => <Avatar key={a} className="size-9"><AvatarFallback>{a}</AvatarFallback></Avatar>)}</div> },
  { id: "alert", name: "Alert", demo: () => <Alert variant="destructive" className="max-w-64"><AlertCircle /><AlertTitle>Payment failed</AlertTitle><AlertDescription>Check your card details.</AlertDescription></Alert> },
  {
    id: "dialog", name: "Dialog", demo: () => (
      <Dialog>
        <DialogTrigger asChild><Button size="sm" variant="secondary">Open dialog</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel booking?</DialogTitle><DialogDescription>Your spot in Studio Flow will go to the next person on the waitlist.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline">Keep it</Button><Button variant="destructive">Cancel booking</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
];

/** Twelve live components, each linking to its docs page. */
export function ComponentGrid() {
  return (
    <div className="grid-row grid gap-px bg-[var(--grid-line)] sm:grid-cols-2 lg:grid-cols-4">
      {CELLS.map((c) => (
        <div key={c.id} className="flex min-h-48 flex-col bg-background">
          <Link href={`/docs/${c.id}`} className="group flex items-center justify-between px-4 pt-3 font-mono text-xs text-muted-foreground hover:text-site-accent">
            {c.name}<ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          <div className="flex flex-1 items-center justify-center px-6 pb-6 pt-3">{c.demo()}</div>
        </div>
      ))}
    </div>
  );
}
