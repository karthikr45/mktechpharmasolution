import Link from "next/link";

const nav = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/trainees", label: "Trainees" },
  { href: "/portal/sessions", label: "Sessions" },
  { href: "/portal/analytics", label: "Analytics" },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Training Portal</h1>
          <p className="text-sm text-slate-400">
            Records, SOPs and GxP-aligned analytics
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        <aside className="card p-2 md:p-3 h-fit">
          <nav className="flex md:flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-pharma-border/40 hover:text-white"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
