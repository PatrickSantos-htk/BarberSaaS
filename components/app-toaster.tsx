"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

function AppToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-center"
      theme={resolvedTheme === "light" ? "light" : "dark"}
      toastOptions={{
        style: {
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          color: "var(--color-foreground)",
        },
      }}
    />
  );
}

export { AppToaster };
