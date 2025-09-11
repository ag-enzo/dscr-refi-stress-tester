import * as React from "react";
import { Card } from "./ui/card";
import { fmtUSD, fmtPct } from "../../lib/format";

export interface MetricsPanelProps {
  adsYear1?: number;
  dscrAtEvaluated?: number;
  evaluatedLoan?: number;
  disabled?: boolean;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ adsYear1, dscrAtEvaluated, evaluatedLoan, disabled }) => {
  function fmtUSDField(val?: number) {
    if (disabled) return "—";
    return fmtUSD(val);
  }
  function fmtPctField(val?: number, digits = 3) {
    if (disabled) return "—";
    return fmtPct(val, digits);
  }
  return (
    <Card className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200 bg-white" aria-label="Metrics Panel">
      <div className="flex flex-row gap-6">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Evaluated Loan</span>
          <span className="text-lg font-medium text-gray-900">{fmtUSDField(evaluatedLoan)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Year-1 ADS</span>
          <span className="text-lg font-medium text-gray-900">{fmtUSDField(adsYear1)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">DSCR @ Loan</span>
          <span className="text-lg font-medium text-gray-900">{fmtPctField(dscrAtEvaluated, 3)}</span>
        </div>
      </div>
    </Card>
  );
};
