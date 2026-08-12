"use client";

import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

function Tooltip({
  content,
  children,
  className,
}: {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);

  function show() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({ top: rect.top, left: rect.left + rect.width / 2 });
    setOpen(true);
  }

  return (
    <span
      ref={triggerRef}
      className={cn("inline-flex min-w-0", className)}
      onMouseEnter={show}
      onMouseLeave={() => setOpen(false)}
      onFocus={show}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <span
            role="tooltip"
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-sm border border-border-strong bg-surface-raised px-2 py-1 text-xs text-foreground shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            style={{ top: coords.top - 8, left: coords.left }}
          >
            {content}
          </span>,
          document.body
        )}
    </span>
  );
}

export { Tooltip };
