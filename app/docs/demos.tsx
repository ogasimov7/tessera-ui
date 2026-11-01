"use client";

import { AlertCircle, CircleCheck, Info, Terminal, TriangleAlert, Trash2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const INVOICES = [["INV001", "Paid", "Card", "$250.00"], ["INV002", "Pending", "Transfer", "$150.00"], ["INV003", "Unpaid", "Card", "$350.00"]];

export const DEMOS: Record<string, () => React.ReactNode> = {
  accordion: () => (
    <Accordion type="single" collapsible defaultValue="a" className="w-full max-w-md">
      <AccordionItem value="a"><AccordionTrigger>Is it accessible?</AccordionTrigger><AccordionContent>Yes. It follows the WAI-ARIA design pattern and is fully keyboard navigable.</AccordionContent></AccordionItem>
      <AccordionItem value="b"><AccordionTrigger>Can I restyle it?</AccordionTrigger><AccordionContent>Every color, radius and font comes from the design tokens.</AccordionContent></AccordionItem>
      <AccordionItem value="c"><AccordionTrigger>Does it animate?</AccordionTrigger><AccordionContent>Yes, opening and closing are animated with tw-animate-css.</AccordionContent></AccordionItem>
    </Accordion>
  ),
  alert: () => (
    <div className="grid w-full max-w-md gap-3">
      <Alert><Terminal /><AlertTitle>Heads up</AlertTitle><AlertDescription>You can add components with the CLI.</AlertDescription></Alert>
      <Alert variant="info"><Info /><AlertTitle>New version available</AlertTitle><AlertDescription>Tessera 1.1 adds status colors.</AlertDescription></Alert>
      <Alert variant="success"><CircleCheck /><AlertTitle>Payment received</AlertTitle><AlertDescription>Your receipt is on its way.</AlertDescription></Alert>
      <Alert variant="warning"><TriangleAlert /><AlertTitle>Card expires soon</AlertTitle><AlertDescription>Update it before the 30th to avoid a failed renewal.</AlertDescription></Alert>
      <Alert variant="destructive"><AlertCircle /><AlertTitle>Payment failed</AlertTitle><AlertDescription>Check your card details and try again.</AlertDescription></Alert>
    </div>
  ),
  avatar: () => (
    <div className="flex items-center gap-3">
      <Avatar><AvatarFallback>SD</AvatarFallback></Avatar>
      <Avatar className="size-10"><AvatarFallback>JL</AvatarFallback></Avatar>
      <div className="flex -space-x-2 *:ring-2 *:ring-background"><Avatar><AvatarFallback>IN</AvatarFallback></Avatar><Avatar><AvatarFallback>OM</AvatarFallback></Avatar><Avatar><AvatarFallback>+3</AvatarFallback></Avatar></div>
    </div>
  ),
  checkbox: () => (
    <div className="grid gap-3">
      <div className="flex items-center gap-2"><Checkbox id="demo-terms" defaultChecked /><Label htmlFor="demo-terms">Accept terms and conditions</Label></div>
      <div className="flex items-center gap-2"><Checkbox id="demo-news" /><Label htmlFor="demo-news">Send me the newsletter</Label></div>
    </div>
  ),
  dialog: () => (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Edit profile</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit profile</DialogTitle><DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription></DialogHeader>
        <div className="grid gap-2"><Label htmlFor="demo-dname">Name</Label><Input id="demo-dname" defaultValue="Leyla Mammadova" /></div>
        <DialogFooter><Button>Save changes</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  "dropdown-menu": () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">Open menu</Button></DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuItem>Billing<DropdownMenuShortcut>⌘B</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuCheckboxItem checked>Email notifications</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  popover: () => (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Open popover</Button></PopoverTrigger>
      <PopoverContent className="grid gap-3">
        <div className="grid gap-1"><p className="font-medium">Dimensions</p><p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p></div>
        <div className="grid grid-cols-[80px_1fr] items-center gap-2"><Label htmlFor="demo-w">Width</Label><Input id="demo-w" defaultValue="100%" className="h-8" /></div>
      </PopoverContent>
    </Popover>
  ),
  progress: () => <Progress value={66} className="w-full max-w-sm" aria-label="Upload progress" />,
  "radio-group": () => (
    <RadioGroup defaultValue="comfortable">
      {[["default", "Default"], ["comfortable", "Comfortable"], ["compact", "Compact"]].map(([v, l]) => (
        <div key={v} className="flex items-center gap-2"><RadioGroupItem value={v} id={`demo-r-${v}`} /><Label htmlFor={`demo-r-${v}`}>{l}</Label></div>
      ))}
    </RadioGroup>
  ),
  select: () => (
    <Select>
      <SelectTrigger className="w-[200px]" aria-label="Plan"><SelectValue placeholder="Select a plan" /></SelectTrigger>
      <SelectContent><SelectItem value="starter">Starter</SelectItem><SelectItem value="team">Team</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem></SelectContent>
    </Select>
  ),
  separator: () => (
    <div className="w-full max-w-sm">
      <p className="font-medium">Tessera UI</p><p className="text-sm text-muted-foreground">Components built on design tokens.</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm"><span>Docs</span><Separator orientation="vertical" /><span>Themes</span><Separator orientation="vertical" /><span>Source</span></div>
    </div>
  ),
  skeleton: () => (
    <div className="flex items-center gap-4"><Skeleton className="size-12 rounded-full" /><div className="grid gap-2"><Skeleton className="h-4 w-[220px]" /><Skeleton className="h-4 w-[160px]" /></div></div>
  ),
  slider: () => <Slider defaultValue={[50]} max={100} step={1} className="w-full max-w-sm" aria-label="Volume" />,
  table: () => (
    <Table className="max-w-lg">
      <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Status</TableHead><TableHead>Method</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
      <TableBody>{INVOICES.map(([id, st, m, a]) => (
        <TableRow key={id}><TableCell className="font-medium">{id}</TableCell><TableCell>{st}</TableCell><TableCell>{m}</TableCell><TableCell className="text-right tabular-nums">{a}</TableCell></TableRow>
      ))}</TableBody>
    </Table>
  ),
  tooltip: () => (
    <Tooltip>
      <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>
      <TooltipContent>Add to library</TooltipContent>
    </Tooltip>
  ),
  button: () => (
    <div className="flex flex-wrap justify-center gap-2">
      <Button>Button</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button><Button variant="destructive"><Trash2 /> Delete</Button><Button variant="link">Link</Button>
    </div>
  ),
  badge: () => (
    <div className="grid justify-items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2"><Badge>Badge</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="outline">Outline</Badge></div>
      <div className="flex flex-wrap justify-center gap-2"><Badge variant="success">Paid</Badge><Badge variant="warning">Pending</Badge><Badge variant="destructive">Failed</Badge><Badge variant="info">New</Badge></div>
    </div>
  ),
  card: () => (
    <Card className="w-full max-w-[360px]">
      <CardHeader><CardTitle>Book a class</CardTitle><CardDescription>Reserve a spot in tomorrow&apos;s 7:30 flow.</CardDescription></CardHeader>
      <CardContent className="grid gap-2"><Label htmlFor="demo-name">Name</Label><Input id="demo-name" placeholder="Your name" /></CardContent>
      <CardFooter className="justify-between"><Button variant="outline">Cancel</Button><Button>Reserve</Button></CardFooter>
    </Card>
  ),
  input: () => (
    <div className="grid w-full max-w-xs gap-2"><Label htmlFor="demo-email">Email</Label><Input id="demo-email" type="email" placeholder="name@example.com" /></div>
  ),
  textarea: () => <div className="grid w-full max-w-sm gap-2"><Label htmlFor="demo-msg">Message</Label><Textarea id="demo-msg" placeholder="Type your message here." /></div>,
  switch: () => <div className="flex items-center gap-2"><Switch id="demo-air" defaultChecked /><Label htmlFor="demo-air">Airplane mode</Label></div>,
  tabs: () => (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList><TabsTrigger value="account">Account</TabsTrigger><TabsTrigger value="password">Password</TabsTrigger></TabsList>
      <TabsContent value="account"><Card><CardHeader><CardTitle>Account</CardTitle><CardDescription>Make changes to your account here.</CardDescription></CardHeader><CardContent><Input defaultValue="Leyla Mammadova" aria-label="Name" /></CardContent></Card></TabsContent>
      <TabsContent value="password"><Card><CardHeader><CardTitle>Password</CardTitle><CardDescription>Change your password here.</CardDescription></CardHeader><CardContent><Input type="password" aria-label="New password" /></CardContent></Card></TabsContent>
    </Tabs>
  ),
};

export function Demo({ id }: { id: string }) {
  return <>{DEMOS[id]?.()}</>;
}
