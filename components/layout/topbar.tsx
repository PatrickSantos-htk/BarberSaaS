"use client";

import { usePathname } from "next/navigation";
import { Scissors } from "lucide-react";
import { navItems } from "@/components/layout/nav-items";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { formatDayMonthPT, formatWeekdayShortPT, toISODate } from "@/lib/utils";

function Topbar() {
  const pathname = usePathname();
  const current = navItems.find((item) => item.href === pathname);
  const today = toISODate(new Date());

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
        </p>
        <ThemeToggle />
      </div>
    </header>
  );
}

export { Topbar };
