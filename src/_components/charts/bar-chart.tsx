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
    <ResponsiveContainer width="100%" height={height} minWidth={300}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{
          top: 5,
          right: 10,
          left: layout === "horizontal" ? 10 : -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        {layout === "vertical" ? (
          <>
            <XAxis
              dataKey={xKey}
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              width={40}
            />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <YAxis
              dataKey={xKey}
              type="category"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
              width={100}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            fontSize: "12px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
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
