import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  );
}
