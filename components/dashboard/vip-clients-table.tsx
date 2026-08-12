import { Crown } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrencyBRL } from "@/lib/utils";

export interface VipClientRow {
  clientId: string;
  name: string;
  visits: number;
  revenue: number;
}

function VipClientsTable({ rows }: { rows: VipClientRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Crown}
        title="Ainda sem histórico neste período"
        description="O ranking de clientes aparece assim que houver atendimentos concluídos."
      />
    );
  }

  return (
    <div className="panel overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="w-10 px-5 py-3 font-medium">#</th>
            <th className="px-2 py-3 font-medium">Cliente</th>
            <th className="px-2 py-3 text-right font-medium">Atendimentos</th>
            <th className="px-5 py-3 text-right font-medium">Faturado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, index) => (
            <tr key={row.clientId}>
              <td className="px-5 py-3 font-display text-accent">{index + 1}</td>
              <td className="px-2 py-3 text-foreground">
                <span className="flex items-center gap-2">
                  {index === 0 && <Crown className="h-3.5 w-3.5 text-accent" aria-hidden="true" />}
                  {row.name}
                </span>
              </td>
              <td className="px-2 py-3 text-right text-muted">{row.visits}</td>
              <td className="px-5 py-3 text-right font-medium text-foreground">
                {formatCurrencyBRL(row.revenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { VipClientsTable };
