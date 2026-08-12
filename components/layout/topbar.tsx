"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Scissors, Settings } from "lucide-react";
import { navItems } from "@/components/layout/nav-items";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { formatDayMonthPT, formatTimeBR, formatWeekdayShortPT, todayISO } from "@/lib/utils";

function Topbar() {
  const pathname = usePathname();
  const current = navItems.find((item) => item.href === pathname);
  const today = todayISO();
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatTimeBR());
    const interval = setInterval(() => setTime(formatTimeBR()), 15_000);
    return () => clearInterval(interval);
  }, []);

  async function handleSignOut() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-4 md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <Scissors className="h-4 w-4 text-accent" aria-hidden="true" />
        <span className="font-display text-lg text-foreground">
          {current?.label ?? "Barber°"}
        </span>
      </div>
      <h1 className="hidden font-display text-2xl text-foreground md:block">
        {current?.label ?? "Painel"}
      </h1>
      <div className="flex items-center gap-3">
        <p className="hidden text-sm capitalize text-muted sm:block">
          {formatWeekdayShortPT(today)}, {formatDayMonthPT(today)}
          {time ? <span className="tabular-nums"> · {time}</span> : null}
        </p>
        <Link
          href="/configuracoes"
          aria-label="Configurações"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <Settings className="h-4 w-4" />
        </Link>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Sair da conta"
          className="md:hidden"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

export { Topbar };
