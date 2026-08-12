"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyPoint } from "@/lib/finance";
import { formatCurrencyBRL, formatMonthShortPT } from "@/lib/utils";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const point: MonthlyPoint = payload[0].payload;
  return (
    <div className="rounded-md border border-border-strong bg-surface p-3 text-xs shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
      <p className="mb-1.5 font-display text-sm text-foreground">{formatMonthShortPT(label)}</p>
      <p className="text-status-confirmed">Faturamento: {formatCurrencyBRL(point.grossRevenue)}</p>
      <p className="text-status-canceled">Despesas: {formatCurrencyBRL(point.totalExpenses)}</p>
      <p className="text-status-paid">Clientes atendidos: {point.clientsServed}</p>
    </div>
  );
}

function MonthlyTrendChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonthShortPT}
            stroke="var(--muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="money"
            stroke="var(--muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCurrencyBRL(value).replace(",00", "")}
            width={80}
          />
          <YAxis
            yAxisId="clients"
            orientation="right"
            stroke="var(--muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={32}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--surface-raised)" }} />
          <Bar
            yAxisId="money"
            dataKey="grossRevenue"
            name="Faturamento"
            fill="var(--status-confirmed)"
            radius={[3, 3, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            yAxisId="money"
            dataKey="totalExpenses"
            name="Despesas"
            fill="var(--status-canceled)"
            radius={[3, 3, 0, 0]}
            maxBarSize={28}
          />
          <Line
            yAxisId="clients"
            dataKey="clientsServed"
            name="Clientes atendidos"
            stroke="var(--status-paid)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export { MonthlyTrendChart };
