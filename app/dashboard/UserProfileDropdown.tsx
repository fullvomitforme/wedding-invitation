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
  "flex min-h-[36px] cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-xs text-foreground outline-none transition-colors hover:bg-muted/20 hover:text-foreground focus:bg-muted/20 focus:text-foreground data-[highlighted]:bg-muted/20 data-[highlighted]:text-foreground data-[highlighted]:outline-none";

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
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/10 bg-muted/20 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border/20 hover:bg-muted/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Open account menu"
        >
          {userInitial}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-50 min-w-[220px] rounded-md border border-border/10 bg-card p-1 shadow-lg"
        >
          {/* User */}
          <div className="border-b border-border/10 px-2 py-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {userDisplayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          </div>

          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/dashboard" className={cn(isDashboard && "bg-muted/20 text-primary")}>
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

          <DropdownMenu.Separator className="my-1 h-px bg-border/10" />

          <DropdownMenu.Item className={itemClass} disabled>
            <Command className="size-3.5 shrink-0" aria-hidden />
            <span className="flex-1">Command Menu</span>
            <kbd className="rounded border border-border/10 bg-muted/20 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </DropdownMenu.Item>
          <div className="flex items-center justify-between gap-2 px-2 py-1.5">
            <span className="text-xs text-muted-foreground">Theme</span>
            <div className="flex rounded-md border border-border/10 bg-muted/20 p-0.5" role="group" aria-label="Theme">
              <button
                type="button"
                onClick={() => setTheme("system")}
                title="System"
                className={cn(
                  "rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  theme === "system" && "border border-border/10 bg-muted/30 text-foreground"
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
                  "rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  theme === "light" && "border border-border/10 bg-muted/30 text-foreground"
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
                  "rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  theme === "dark" && "border border-border/10 bg-muted/30 text-foreground"
                )}
                aria-pressed={theme === "dark"}
              >
                <Moon className="size-3.5" aria-hidden />
              </button>
            </div>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-border/10" />

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

          <DropdownMenu.Separator className="my-1 h-px bg-border/10" />

          <div className="p-1">
            <Link
              href="/request-access"
              className="flex min-h-[36px] w-full items-center justify-center rounded-md bg-muted/20 text-xs font-medium text-foreground transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              Upgrade to Pro
            </Link>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
