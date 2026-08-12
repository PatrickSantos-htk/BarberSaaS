import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
  "aria-label": string;
}

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={props["aria-label"]}
      className={cn("inline-flex rounded-sm border border-border-strong bg-surface p-0.5", className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          role="tab"
          type="button"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
            option.value === value
              ? "bg-accent text-accent-foreground"
              : "text-muted hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export { SegmentedControl };
