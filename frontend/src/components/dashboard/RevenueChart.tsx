import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import type { SalesDataPoint } from "../../types/index";
import Card from "../ui/Card";

type Props = { weekly: SalesDataPoint[]; yearly: SalesDataPoint[] };

function formatRevenue(value: number) {
  if (value >= 1000) return `$${Math.round(value / 1000)}k`;
  return `$${value}`;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-container-highest px-3 py-2 rounded-lg text-xs font-label shadow-xl">
      <p className="text-secondary/60 mb-0.5">{label}</p>
      <p className="text-primary font-bold">{formatRevenue(payload[0].value)}</p>
    </div>
  );
}

export default function RevenueChart({ weekly, yearly }: Props) {
  const [mode, setMode] = useState<"weekly" | "yearly">("weekly");
  const data = mode === "weekly" ? weekly : yearly;

  return (
    <Card padding="lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-headline italic font-bold">
            {mode === "weekly" ? "Midnight Sale Cycles" : "Revenue (Last 12 Months)"}
          </h2>
          <p className="text-sm font-label text-secondary/50 mt-1">
            {mode === "weekly" ? "Last 7 days conversion volume" : "Monthly revenue breakdown"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-surface-container-lowest rounded-full p-1 gap-1">
          {(["weekly", "yearly"] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={[
                "px-4 py-1.5 rounded-full text-xs font-label font-medium transition-all",
                mode === m
                  ? "bg-primary-container text-on-primary-fixed"
                  : "text-secondary/60 hover:text-on-surface",
              ].join(" ")}
            >
              {m === "weekly" ? "7 Days" : "12 Months"}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="#2a2a2a" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#b5c8df", fontSize: 11, fontFamily: "Manrope" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatRevenue}
            tick={{ fill: "#b5c8df", fontSize: 11, fontFamily: "Manrope" }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,183,131,0.05)" }} />
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i === data.length - 1 ? "#ffb783" : "rgba(255,183,131,0.25)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
