"use client";

import { memo } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BarConfig {
  dataKey: string;
  name: string;
  color: string;
}

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  bars: BarConfig[];
  layout?: "horizontal" | "vertical";
  height?: number;
}

export const BarChart = memo(function BarChart({
  data,
  xKey,
  bars,
  layout = "vertical",
  height = 300,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} layout={layout}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        {layout === "vertical" ? (
          <>
            <XAxis
              dataKey={xKey}
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              dataKey={xKey}
              type="category"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              width={150}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
});
