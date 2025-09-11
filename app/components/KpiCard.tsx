import * as React from "react";
import { Card } from "./ui/card";
import { fmtUSD, fmtPct } from "../../lib/format";

export interface KpiCardProps {
  label: string;
  value?: string | number;
  unit?: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, unit, highlight, icon }) => {
  let displayValue = "—";
  if (value !== undefined && value !== null && !Number.isNaN(value)) {
    if (unit === "$") displayValue = fmtUSD(Number(value));
    else if (unit === "%") displayValue = fmtPct(Number(value));
    else displayValue = String(value);
  }
  return (
    <Card
      className={`flex flex-col items-center justify-center p-4 min-w-[120px] min-h-[90px] rounded-lg shadow-sm border ${
        highlight ? "bg-blue-50 border-blue-400" : "bg-white border-gray-200"
      }`}
      aria-label={label}
    >
      {icon && <div className="mb-1 text-2xl">{icon}</div>}
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-semibold ${highlight ? "text-blue-700" : "text-gray-900"}`}>
        {displayValue}
        {unit && displayValue !== "—" ? <span className="ml-1 text-base text-gray-500">{unit}</span> : null}
      </div>
    </Card>
  );
};
