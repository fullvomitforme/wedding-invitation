"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import {
  LayoutDashboard,
  Settings,
  Plus,
  Command,
  Monitor,
  Sun,
  Moon,
  Home,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const THEME_KEY = "attimo-theme";
type Theme = "system" | "light" | "dark";

function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored) setThemeState(stored);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const applied =
      theme === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(applied);
  }, [theme]);
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    if (typeof window !== "undefined") localStorage.setItem(THEME_KEY, t);
  }, []);
  return [theme, setTheme] as const;
}

const itemClass =
  "flex min-h-[36px] cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-xs text-foreground outline-none transition-colors duration-150 hover:bg-white/5 hover:text-foreground focus:bg-white/5 focus:text-foreground data-[highlighted]:bg-white/5 data-[highlighted]:text-foreground data-[highlighted]:outline-none";

export function UserProfileDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [theme, setTheme] = useTheme();

  const userDisplayName =
    session?.user?.name?.trim() || session?.user?.email?.split("@")[0] || "User";
  const userEmail = session?.user?.email ?? "";
  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? session?.user?.email?.[0]?.toUpperCase() ?? "?";

  const isDashboard = pathname === "/dashboard" || pathname?.startsWith("/dashboard/weddings") || pathname === "/dashboard/new";

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex justify-center items-center bg-card hover:bg-white/5 border border-border hover:border-border/20 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background w-8 h-8 font-medium text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-150 shrink-0"
          aria-label="Open account menu"
        >
          {userInitial}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-50 bg-card shadow-lg p-1 border border-border rounded min-w-[220px]"
        >
          {/* User */}
          <div className="px-2 py-2 border-border border-b">
            <p className="font-semibold text-[13px] text-foreground truncate">
              {userDisplayName}
            </p>
            <p className="text-[11px] text-tertiary-foreground truncate">{userEmail}</p>
          </div>

          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/dashboard" className={cn(isDashboard && "bg-white/5 text-primary")}>
              <LayoutDashboard className="size-3.5 shrink-0" aria-hidden />
              Dashboard
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/dashboard/settings">
              <Settings className="size-3.5 shrink-0" aria-hidden />
              Account Settings
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/dashboard/new">
              <Plus className="size-3.5 shrink-0" aria-hidden />
              New project
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 bg-border h-px" />

          <DropdownMenu.Item className={itemClass} disabled>
            <Command className="size-3.5 shrink-0" aria-hidden />
            <span className="flex-1">Command Menu</span>
            <kbd className="bg-white/5 px-1.5 py-0.5 border border-border rounded font-mono text-[10px] text-tertiary-foreground">
              ⌘K
            </kbd>
          </DropdownMenu.Item>
          <div className="flex justify-between items-center gap-2 px-2 py-1.5">
            <span className="text-[11px] text-neutral-500">Theme</span>
            <div className="flex bg-white/5 p-0.5 border border-white/[0.06] rounded" role="group" aria-label="Theme">
              <button
                type="button"
                onClick={() => setTheme("system")}
                title="System"
                className={cn(
                  "p-1 rounded focus:outline-none focus-visible:ring-[#BFA14A] focus-visible:ring-2 text-neutral-500 hover:text-neutral-200 transition-colors",
                  theme === "system" && "border border-white/[0.06] bg-white/10 text-neutral-200"
                )}
                aria-pressed={theme === "system"}
              >
                <Monitor className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                title="Light"
                className={cn(
                  "p-1 rounded focus:outline-none focus-visible:ring-[#BFA14A] focus-visible:ring-2 text-neutral-500 hover:text-neutral-200 transition-colors",
                  theme === "light" && "border border-white/[0.06] bg-white/10 text-neutral-200"
                )}
                aria-pressed={theme === "light"}
              >
                <Sun className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                title="Dark"
                className={cn(
                  "p-1 rounded focus:outline-none focus-visible:ring-[#BFA14A] focus-visible:ring-2 text-neutral-500 hover:text-neutral-200 transition-colors",
                  theme === "dark" && "border border-white/[0.06] bg-white/10 text-neutral-200"
                )}
                aria-pressed={theme === "dark"}
              >
                <Moon className="size-3.5" aria-hidden />
              </button>
            </div>
          </div>

          <DropdownMenu.Separator className="my-1 bg-border h-px" />

          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/">
              <Home className="size-3.5 shrink-0" aria-hidden />
              Home
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={itemClass}
            onSelect={(e) => {
              e.preventDefault();
              handleSignOut();
            }}
          >
            <LogOut className="size-3.5 shrink-0" aria-hidden />
            Log out
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 bg-border h-px" />

          <div className="p-1">
            <Link
              href="/request-access"
              className="flex justify-center items-center bg-transparent hover:bg-white/5 border border-border rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card w-full min-h-[36px] font-medium text-[11px] text-foreground hover:text-foreground transition-colors duration-150"
            >
              Upgrade to Pro
            </Link>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
