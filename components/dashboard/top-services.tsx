import { Scissors } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrencyBRL } from "@/lib/utils";

export interface TopServiceRow {
  serviceId: string;
  name: string;
  count: number;
  revenue: number;
}

function TopServices({ rows }: { rows: TopServiceRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Scissors}
        title="Sem atendimentos concluídos"
        description="O ranking de serviços aparece assim que houver atendimentos concluídos no período."
      />
    );
  }

  const max = Math.max(...rows.map((row) => row.revenue));

  return (
    <div className="panel flex flex-col gap-4 p-5">
      {rows.map((row) => (
        <div key={row.serviceId}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-foreground">{row.name}</span>
            <span className="shrink-0 text-muted-foreground">
              {row.count}x · {formatCurrencyBRL(row.revenue)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-raised">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${max > 0 ? (row.revenue / max) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export { TopServices };
