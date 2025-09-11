import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import type { ShockRow } from "../../lib/types/finance";
import { fmtUSD, fmtRatePct } from "../../lib/format";

export interface ShockChartProps {
  data: ShockRow[];
  disabled?: boolean;
}

export const ShockChart: React.FC<ShockChartProps> = ({ data, disabled }) => {
  if (disabled) {
    return (
      <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
        Chart unavailable (fix input errors)
      </div>
    );
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rate" tickFormatter={v => fmtRatePct(v)} tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={v => fmtUSD(v)} tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(v: number | string) => fmtUSD(Number(v))}
            labelFormatter={(l: number | string) => `Rate: ${fmtRatePct(Number(l))}`}
          />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="maxLoanDSCR" name="Max Loan (DSCR)" stroke="#2563eb" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="maxLoanLTV" name="Max Loan (LTV)" stroke="#059669" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="maxLoanBinding" name="Binding Loan" stroke="#f59e42" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
