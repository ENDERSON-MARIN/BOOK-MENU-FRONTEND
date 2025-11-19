"use client";

import { memo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface LineConfig {
  dataKey: string;
  name: string;
  color: string;
}

interface LineChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  lines: LineConfig[];
  height?: number;
}

export const LineChart = memo(function LineChart({
  data,
  xKey,
  lines,
  height = 300,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={300}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            fontSize: "12px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            dot={{ fill: line.color, r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
});
