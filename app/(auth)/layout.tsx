import type { ReactNode } from "react";
import { Scissors } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex items-center justify-center gap-2">
          <Scissors className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="font-display text-2xl text-foreground">
            Barber<span className="text-accent">°</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
