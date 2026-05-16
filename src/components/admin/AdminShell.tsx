"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Clapperboard,
  Building2,
  Users,
  MessageSquare,
  Settings2,
  LogOut,
} from "lucide-react";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface AdminShellProps {
  children: ReactNode;
  pageTitle: string;
  unreadCount?: number;
}

const navItems = [
  { label: "Dashboard", href: "/kashfoffice/dashboard", Icon: LayoutDashboard },
  { label: "Projects",  href: "/kashfoffice/projects",  Icon: Clapperboard },
  { label: "Clients",   href: "/kashfoffice/clients",   Icon: Building2 },
  { label: "Team",      href: "/kashfoffice/team",      Icon: Users },
  { label: "Messages",  href: "/kashfoffice/messages",  Icon: MessageSquare, isMessages: true },
];

const systemItems = [
  { label: "Settings", href: "/kashfoffice/settings", Icon: Settings2 },
];

export default function AdminShell({ children, pageTitle, unreadCount = 0 }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/kashfoffice/login");
  }

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="h-screen overflow-hidden flex">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <span className="font-black text-lg tracking-tighter">KASHF</span>
          <span className="text-gray-400 font-light text-sm"> Office</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase px-3 py-2 mt-2">
            CONTENT
          </p>
          {navItems.map(({ label, href, Icon, isMessages }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {isMessages && unreadCount > 0 && (
                  <span
                    className={cn(
                      "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                      isActive ? "bg-white text-gray-900" : "bg-gray-900 text-white"
                    )}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}

          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase px-3 py-2 mt-4">
            SYSTEM
          </p>
          {systemItems.map(({ label, href, Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 mb-1">
            <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
              A
            </div>
            <span>admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-black tracking-tight">{pageTitle}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{today}</span>
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
