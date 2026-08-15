import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "SkillSeal — Agent tool trust", description: "Version-bound trust and payment infrastructure for autonomous agents." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
