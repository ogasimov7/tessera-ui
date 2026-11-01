import type { Metadata } from "next";
import { Suspense } from "react";
import { Generator } from "./generator";

export const metadata: Metadata = { title: "Generate" };

export default function GeneratePage() {
  return <Suspense><Generator /></Suspense>;
}
