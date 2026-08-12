import { CalendarDays, LayoutDashboard, Scissors, Users2, Wallet } from "lucide-react";

export const navItems = [
  { href: "/", label: "Painel", icon: LayoutDashboard },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/clientes", label: "Clientes", icon: Users2 },
  { href: "/servicos", label: "Serviços", icon: Scissors },
  { href: "/financeiro", label: "Financeiro", icon: Wallet },
] as const;
