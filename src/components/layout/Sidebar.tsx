"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Calendario", icon: CalendarIcon },
  { href: "/shared", label: "Condivisioni", icon: ShareIcon },
];

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/** Contenuto logo + nav riutilizzabile in Sidebar e drawer mobile */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isSharedPage = pathname.startsWith("/shared");
  const [logoError, setLogoError] = useState(false);

  return (
    <>
      <div className="flex min-h-[72px] w-full items-center justify-center border-b border-[var(--gold)]/30 bg-[var(--navy)] px-3 py-3" style={{ backgroundColor: "var(--navy)" }}>
        {!logoError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/logo-agenda-legale.png"
            alt="Agenda Legale"
            className="h-14 w-full max-w-[180px] object-contain object-center"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-[var(--gold)]/20 text-[var(--gold)]">
            <CalendarIcon className="h-6 w-6" />
          </div>
        )}
      </div>
      <nav className="flex flex-col gap-0.5 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            (href === "/" && !isSharedPage) || (href === "/shared" && isSharedPage);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-l-2 border-[var(--gold)] bg-[var(--navy-light)]/80 text-[var(--gold)]"
                  : "text-white/90 hover:bg-[var(--navy-light)]/50 hover:text-white"
              }`}
              style={
                isActive
                  ? { borderLeftColor: "var(--gold)", backgroundColor: "rgba(42, 63, 95, 0.5)" }
                  : undefined
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function Sidebar() {
  return (
    <aside
      className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-[var(--gold)]/20 bg-[var(--navy)]"
      style={{ backgroundColor: "var(--navy)" }}
    >
      <SidebarContent />
    </aside>
  );
}
