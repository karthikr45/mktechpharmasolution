import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "MKTech PharmaSim — VR Training & Digital Twin for Pharma",
  description:
    "Immersive VR training, machine simulation and real-time digital twin platform for pharmaceutical manufacturing. Built for Aurobindo, MSN and other tier-1 formulations players.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-pharma-border bg-pharma-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-7 w-7 rounded-md bg-gradient-to-br from-brand-500 to-pharma-accent" />
          <span className="font-semibold tracking-tight">MKTech PharmaSim</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/simulator"
            className="rounded-md px-3 py-1.5 text-slate-300 hover:bg-pharma-border/40 hover:text-white"
          >
            Simulator
          </Link>
          <Link
            href="/portal"
            className="rounded-md px-3 py-1.5 text-slate-300 hover:bg-pharma-border/40 hover:text-white"
          >
            Portal
          </Link>
          <Link
            href="/portal/analytics"
            className="rounded-md px-3 py-1.5 text-slate-300 hover:bg-pharma-border/40 hover:text-white"
          >
            Analytics
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-pharma-border bg-pharma-bg/60">
      <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-slate-400 flex flex-wrap justify-between gap-2">
        <span>© {new Date().getFullYear()} MKTech PharmaSim — MVP</span>
        <span className="font-mono">
          21 CFR Part 11 · EU Annex 11 · GAMP 5 aware
        </span>
      </div>
    </footer>
  );
}
