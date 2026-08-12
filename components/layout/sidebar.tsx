"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/nav-items";

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="flex items-center gap-2 border-b border-border px-6 py-6">
        <Scissors className="h-5 w-5 text-accent" aria-hidden="true" />
        <span className="font-display text-xl tracking-tight text-foreground">
          Barber<span className="text-accent">°</span>
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navegação principal">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/15 text-accent border-l-2 border-accent"
                  : "border-l-2 border-transparent text-muted hover:bg-surface-raised hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4 text-xs text-muted-foreground">
        BarberSaaS · versão inicial
      </div>
    </aside>
  );
}

export { Sidebar };
