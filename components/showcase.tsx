"use client";

import { AlertCircle, Terminal, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BARS = [42, 64, 38, 80, 56, 92, 70, 48, 86, 60, 74, 96];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TEAM = [["SD", "Sofia Davis", "Owner"], ["JL", "Jackson Lee", "Member"], ["IN", "Isabella Nguyen", "Viewer"]];

/** A realistic set of composed components, used to preview any token set. */
export function Showcase() {
  return (
    <div className="columns-1 gap-4 md:columns-2 xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
      <Card>
        <CardHeader><CardTitle>Create an account</CardTitle><CardDescription>Enter your email below to create your account.</CardDescription></CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-2"><Button variant="outline">GitHub</Button><Button variant="outline">Google</Button></div>
          <div className="flex items-center gap-3 text-[11.5px] uppercase tracking-wider text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">or continue with</div>
          <div className="grid gap-2"><Label htmlFor="sc-email">Email</Label><Input id="sc-email" placeholder="m@example.com" /></div>
          <div className="grid gap-2"><Label htmlFor="sc-pass">Password</Label><Input id="sc-pass" type="password" defaultValue="hunter2hunter" /></div>
        </CardContent>
        <CardFooter><Button className="w-full">Create account</Button></CardFooter>
      </Card>

      <Card>
        <CardHeader><CardDescription>Total revenue</CardDescription>
          <div className="flex flex-wrap items-center gap-2"><span className="font-heading text-3xl font-semibold tabular-nums tracking-tight">$45,231.89</span><Badge variant="secondary">+20.1%</Badge></div>
        </CardHeader>
        <CardContent>
          <div className="flex h-24 items-end gap-1.5" role="img" aria-label="Monthly revenue, January to December">{BARS.map((h, i) => (
            <i key={i} title={`${MONTHS[i]}: $${(h * 47.1).toLocaleString("en-US", { maximumFractionDigits: 0 })}`} className="flex-1 rounded-t-[4px] bg-chart-1 transition-opacity hover:opacity-80" style={{ height: `${h}%` }} />
          ))}</div>
          <div className="mt-2 flex justify-between text-xs tabular-nums text-muted-foreground"><span>Jan</span><span>Jun</span><span>Dec</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Choose what you want to hear about.</CardDescription></CardHeader>
        <CardContent className="grid gap-4">
          {[["Booking requests", "New requests and changes", true], ["Weekly digest", "Every Monday at 9:00", false]].map(([t, d, on]) => (
            <div key={String(t)} className="flex items-center justify-between gap-4">
              <div><Label>{t}</Label><p className="mt-1 text-[12.5px] text-muted-foreground">{d}</p></div>
              <Switch defaultChecked={Boolean(on)} aria-label={String(t)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Team members</CardTitle><CardDescription>Invite your team to collaborate.</CardDescription></CardHeader>
        <CardContent className="grid gap-4">
          {TEAM.map(([a, n, r]) => (
            <div key={n} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-9"><AvatarFallback>{a}</AvatarFallback></Avatar>
                <div className="min-w-0"><p className="text-sm font-medium">{n}</p><p className="truncate text-[12.5px] text-muted-foreground">{n.split(" ")[0].toLowerCase()}@example.com</p></div>
              </div>
              <Badge variant="outline">{r}</Badge>
            </div>
          ))}
        </CardContent>
        <CardFooter className="gap-2"><Input placeholder="Email address" /><Button variant="secondary">Invite</Button></CardFooter>
      </Card>

      <Card>
        <CardHeader><CardTitle>Payments</CardTitle><CardDescription>Recent transactions this week.</CardDescription></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-muted-foreground"><th className="py-2 font-medium">Status</th><th className="py-2 font-medium">Email</th><th className="py-2 text-right font-medium">Amount</th></tr></thead>
            <tbody className="[&_td]:py-2.5 [&_tr:not(:last-child)]:border-b">
              <tr><td><Badge variant="success">Paid</Badge></td><td>ken99@example.com</td><td className="text-right tabular-nums">$316.00</td></tr>
              <tr><td><Badge variant="warning">Pending</Badge></td><td>abe45@example.com</td><td className="text-right tabular-nums">$242.00</td></tr>
              <tr><td><Badge variant="destructive">Failed</Badge></td><td>monserrat@example.com</td><td className="text-right tabular-nums">$837.00</td></tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Tabs defaultValue="upload">
            <TabsList><TabsTrigger value="upload">Upload</TabsTrigger><TabsTrigger value="history">History</TabsTrigger></TabsList>
            <TabsContent value="upload" className="grid gap-4">
              <div className="grid gap-2"><div className="flex justify-between text-sm"><span className="font-medium">brand-assets.zip</span><span className="tabular-nums text-muted-foreground">68%</span></div>
                <Progress value={68} aria-label="Upload progress" /></div>
              <Alert><Terminal /><AlertTitle>Heads up</AlertTitle><AlertDescription>You can add components with the CLI.</AlertDescription></Alert>
              <Alert variant="destructive"><AlertCircle /><AlertTitle>Upload failed</AlertTitle><AlertDescription>The file is over 50 MB.</AlertDescription></Alert>
            </TabsContent>
            <TabsContent value="history" className="text-sm text-muted-foreground">No uploads yet this week.</TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Buttons &amp; badges</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap gap-2"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="destructive"><Trash2 /> Delete</Button></div>
          <div className="flex flex-wrap gap-1.5"><Badge>Badge</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="outline">Outline</Badge><Badge variant="destructive">Destructive</Badge></div>
        </CardContent>
      </Card>
    </div>
  );
}
