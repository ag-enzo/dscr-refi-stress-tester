"use client";
import { useState } from "react";
// import { Container } from "./components/ui/container";
import { validateLoanInputs } from "../lib/types/finance";
import { KpiCard } from "./components/KpiCard";
import { MetricsPanel } from "./components/MetricsPanel";
import { ShockChart } from "./components/ShockChart";
import {
  sizeLoanByDSCR,
  sizeLoanByLTV,
  debtYield,
  annualDebtService,
  buildShockTable,
} from "../lib/finance/core";
import { FaBuilding, FaChartLine, FaMoneyBillWave, FaInfoCircle } from "react-icons/fa";
// import { useRef } from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
// import clsx from "clsx";

// Canonical defaults
const defaultLoanInputs = {
  loanAmount: 0,
  interestRate: 6.5,
  amortizationYears: 30,
  interestOnlyYears: 0,
  termYears: 10,
  annualNOI: 500000,
  annualTaxes: 0,
  annualInsurance: 0,
  annualOther: 0,
  propertyValue: 8000000,
  ltvMaxPct: 65,
  targetDSCR: 1.25,
};
const defaultShockConfig = {
  minRate: 4.5,
  maxRate: 8.5,
  step: 0.25,
};

export default function Home() {
  const [loanInputs, setLoanInputs] = useState(defaultLoanInputs);
  const [shockConfig, setShockConfig] = useState(defaultShockConfig);
  // Info popover state
  const [dealInfoOpen, setDealInfoOpen] = useState(false);
  const [loanInfoOpen, setLoanInfoOpen] = useState(false);
  const [shockInfoOpen, setShockInfoOpen] = useState(false);

  // Handlers
  function handleLoanInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    setLoanInputs((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }
  function handleShockConfigChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    setShockConfig((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }

  const validationErrors = validateLoanInputs(loanInputs);

  // Compute outputs only if no validation errors
  let maxLoanDSCR, maxLoanLTV, bindingLoan, dy, adsYear1, dscrAtEvaluated, shockTable;
  if (validationErrors.length === 0) {
    const inputs = {
      noiAnnual: loanInputs.annualNOI,
      rateAnnualPct: loanInputs.interestRate,
      amortYears: loanInputs.amortizationYears,
      interestOnlyYears: loanInputs.interestOnlyYears,
      termYears: loanInputs.termYears,
      ltvMaxPct: loanInputs.ltvMaxPct,
      value: loanInputs.propertyValue,
      targetDSCR: loanInputs.targetDSCR,
    };
    maxLoanDSCR = sizeLoanByDSCR(
      inputs.noiAnnual,
      inputs.rateAnnualPct,
      inputs.amortYears,
      inputs.interestOnlyYears,
      inputs.targetDSCR
    );
    maxLoanLTV = sizeLoanByLTV(inputs.value, inputs.ltvMaxPct);
    bindingLoan = Math.min(maxLoanDSCR, maxLoanLTV);
    dy = debtYield(inputs.noiAnnual, bindingLoan);
    adsYear1 = annualDebtService(
      bindingLoan,
      inputs.rateAnnualPct,
      inputs.amortYears,
      inputs.interestOnlyYears
    );
    dscrAtEvaluated = adsYear1 > 0 ? inputs.noiAnnual / adsYear1 : undefined;
    const shockCfg = {
      windowBps: 200,
      stepBps: Math.round((shockConfig.step || 0.25) * 100),
      minRate: shockConfig.minRate,
      maxRate: shockConfig.maxRate,
      step: shockConfig.step,
    };
    shockTable = buildShockTable(loanInputs, shockCfg);
  }

  // --- UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <header className="w-full py-12 bg-gradient-to-r from-blue-700/90 via-blue-800/80 to-emerald-700/80 shadow-lg relative">
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center relative z-10">
          <FaBuilding className="text-white text-5xl mb-4 drop-shadow-lg" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
            DSCR / Refi Stress-Tester
          </h1>
          <p className="text-sm md:text-base text-blue-100/90 mb-4 max-w-xl">
            Instantly analyze real estate loan sizing, stress test DSCR, and visualize risk—all in a beautiful, interactive dashboard.
          </p>
        </div>
        {/* Subtle animated background shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute top-0 left-0 w-full h-32 opacity-30" viewBox="0 0 1440 320"><path fill="#fff" fillOpacity="0.2" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
        </div>
      </header>
      <main className="relative z-10 max-w-4xl mx-auto px-4 -mt-16 pb-16">
        <div className="rounded-2xl shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-blue-100 dark:border-gray-800 p-8 mt-0">
          <TooltipProvider>
            <form className="space-y-10">
              {/* Deal Inputs */}
              <fieldset className="rounded-xl p-6 bg-gradient-to-br from-blue-50/60 to-emerald-50/40 dark:from-gray-800/60 dark:to-gray-900/40 shadow-md border border-blue-100 dark:border-gray-800">
                <legend className="font-semibold text-lg mb-2 flex items-center gap-2 relative">
                  <FaMoneyBillWave className="text-emerald-500" /> Deal Inputs
                  <span
                    className="ml-1 cursor-pointer relative"
                    tabIndex={0}
                    onMouseEnter={() => setDealInfoOpen(true)}
                    onMouseLeave={() => setDealInfoOpen(false)}
                  >
                    <FaInfoCircle className="text-blue-400" />
                    {dealInfoOpen && (
                      <span className="absolute left-6 top-1 z-20 bg-white text-gray-900 border border-blue-200 shadow-lg rounded p-3 text-xs max-w-xs w-64 animate-fade-in" role="dialog">
                        <strong>Deal Inputs:</strong> <br />
                        <ul className="list-disc pl-4 mt-1">
                          <li><b>Annual NOI ($):</b> Net Operating Income for the property (income minus expenses, before debt service).</li>
                          <li><b>Property Value ($):</b> Appraised or purchase value of the property.</li>
                          <li><b>LTV Max (%):</b> Maximum loan-to-value ratio allowed for the deal.</li>
                        </ul>
                        <span className="block mt-2 text-blue-500">Hover off the icon to close.</span>
                      </span>
                    )}
                  </span>
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="annualNOI" className="block text-sm font-medium">Annual NOI ($)</label>
                    <input type="number" min={0} name="annualNOI" id="annualNOI" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value={loanInputs.annualNOI} onChange={handleLoanInputChange} />
                  </div>
                  <div>
                    <label htmlFor="propertyValue" className="block text-sm font-medium">Property Value ($)</label>
                    <input type="number" min={0} name="propertyValue" id="propertyValue" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value={loanInputs.propertyValue} onChange={handleLoanInputChange} />
                  </div>
                  <div>
                    <label htmlFor="ltvMaxPct" className="block text-sm font-medium">LTV Max (%)</label>
                    <input type="number" min={0} max={100} name="ltvMaxPct" id="ltvMaxPct" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value={loanInputs.ltvMaxPct ?? 65} onChange={handleLoanInputChange} />
                  </div>
                </div>
              </fieldset>

              {/* Loan Inputs */}
              <fieldset className="rounded-xl p-6 bg-gradient-to-br from-blue-50/60 to-emerald-50/40 dark:from-gray-800/60 dark:to-gray-900/40 shadow-md border border-blue-100 dark:border-gray-800">
                <legend className="font-semibold text-lg mb-2 flex items-center gap-2 relative">
                  <FaChartLine className="text-blue-500" /> Loan Inputs
                  <span
                    className="ml-1 cursor-pointer relative"
                    tabIndex={0}
                    onMouseEnter={() => setLoanInfoOpen(true)}
                    onMouseLeave={() => setLoanInfoOpen(false)}
                  >
                    <FaInfoCircle className="text-blue-400" />
                    {loanInfoOpen && (
                      <span className="absolute left-6 top-1 z-20 bg-white text-gray-900 border border-blue-200 shadow-lg rounded p-3 text-xs max-w-xs w-64 animate-fade-in" role="dialog">
                        <strong>Loan Inputs:</strong> <br />
                        <ul className="list-disc pl-4 mt-1">
                          <li><b>Interest Rate (%):</b> Quoted annual interest rate for the loan.</li>
                          <li><b>Amortization (years):</b> Number of years over which the loan is amortized.</li>
                          <li><b>Interest-Only (years):</b> Years with interest-only payments (no principal).</li>
                          <li><b>Term (years):</b> Total loan term (may be less than amortization).</li>
                          <li><b>Target DSCR:</b> Minimum Debt Service Coverage Ratio required by lender.</li>
                        </ul>
                        <span className="block mt-2 text-blue-500">Hover off the icon to close.</span>
                      </span>
                    )}
                  </span>
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="interestRate" className="block text-sm font-medium">Interest Rate (%)</label>
                    <input type="number" min={0} step={0.01} name="interestRate" id="interestRate" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value={loanInputs.interestRate} onChange={handleLoanInputChange} />
                  </div>
                  <div>
                    <label htmlFor="amortizationYears" className="block text-sm font-medium">Amortization (years)</label>
                    <input type="number" min={0} max={40} name="amortizationYears" id="amortizationYears" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value={loanInputs.amortizationYears} onChange={handleLoanInputChange} />
                  </div>
                  <div>
                    <label htmlFor="interestOnlyYears" className="block text-sm font-medium">Interest-Only (years)</label>
                    <input type="number" min={0} max={10} name="interestOnlyYears" id="interestOnlyYears" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value={loanInputs.interestOnlyYears ?? 0} onChange={handleLoanInputChange} />
                  </div>
                  <div>
                    <label htmlFor="termYears" className="block text-sm font-medium">Term (years)</label>
                    <input type="number" min={0} max={40} name="termYears" id="termYears" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value={loanInputs.termYears} onChange={handleLoanInputChange} />
                  </div>
                  <div>
                    <label htmlFor="targetDSCR" className="block text-sm font-medium">Target DSCR</label>
                    <input type="number" min={0} step={0.01} name="targetDSCR" id="targetDSCR" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value={loanInputs.targetDSCR ?? 1.25} onChange={handleLoanInputChange} />
                  </div>
                </div>
              </fieldset>

              {/* Stress Test Inputs */}
              <fieldset className="rounded-xl p-6 bg-gradient-to-br from-blue-50/60 to-emerald-50/40 dark:from-gray-800/60 dark:to-gray-900/40 shadow-md border border-blue-100 dark:border-gray-800">
                <legend className="font-semibold text-lg mb-2 flex items-center gap-2 relative">
                  <FaChartLine className="text-amber-500" /> Stress Test Inputs
                  <span
                    className="ml-1 cursor-pointer relative"
                    tabIndex={0}
                    onMouseEnter={() => setShockInfoOpen(true)}
                    onMouseLeave={() => setShockInfoOpen(false)}
                  >
                    <FaInfoCircle className="text-blue-400" />
                    {shockInfoOpen && (
                      <span className="absolute left-6 top-1 z-20 bg-white text-gray-900 border border-blue-200 shadow-lg rounded p-3 text-xs max-w-xs w-64 animate-fade-in" role="dialog">
                        <strong>Stress Test Inputs:</strong> <br />
                        <ul className="list-disc pl-4 mt-1">
                          <li><b>Min Rate (%):</b> Starting interest rate for the stress test curve.</li>
                          <li><b>Max Rate (%):</b> Ending interest rate for the stress test curve.</li>
                          <li><b>Step (%):</b> Increment between rates for the shock curve.</li>
                        </ul>
                        <span className="block mt-2 text-blue-500">Hover off the icon to close.</span>
                      </span>
                    )}
                  </span>
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="minRate" className="block text-sm font-medium">Min Rate (%)</label>
                    <input type="number" min={0} step={0.01} name="minRate" id="minRate" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value={shockConfig.minRate} onChange={handleShockConfigChange} />
                  </div>
                  <div>
                    <label htmlFor="maxRate" className="block text-sm font-medium">Max Rate (%)</label>
                    <input type="number" min={0} step={0.01} name="maxRate" id="maxRate" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value={shockConfig.maxRate} onChange={handleShockConfigChange} />
                  </div>
                  <div>
                    <label htmlFor="step" className="block text-sm font-medium">Step (%)</label>
                    <input type="number" min={0.01} step={0.01} name="step" id="step" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value={shockConfig.step} onChange={handleShockConfigChange} />
                  </div>
                </div>
              </fieldset>

              {/* Validation Error Callout */}
              {validationErrors.length > 0 && (
                <div
                  className="mt-10 bg-red-100/90 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-sm shadow-md flex items-center gap-3 animate-fade-in"
                  role="alert"
                  aria-live="assertive"
                >
                  <FaInfoCircle className="text-red-400 text-xl" />
                  <ul className="list-disc pl-5">
                    {validationErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* KPI Cards Row */}
              <div className="flex flex-row gap-4 justify-center mt-8">
                <KpiCard label="Max Loan @ DSCR" value={validationErrors.length ? undefined : maxLoanDSCR} unit="$" icon={<FaChartLine className="text-blue-500" />} />
                <KpiCard label="Max Loan @ LTV" value={validationErrors.length ? undefined : maxLoanLTV} unit="$" icon={<FaMoneyBillWave className="text-emerald-500" />} />
                <KpiCard label="Binding Loan" value={validationErrors.length ? undefined : bindingLoan} unit="$" highlight icon={<FaBuilding className="text-indigo-500" />} />
                <KpiCard label="Debt Yield" value={validationErrors.length ? undefined : dy && (dy * 100)} unit="%" icon={<FaChartLine className="text-amber-500" />} />
              </div>

              {/* Metrics Panel */}
              <div className="flex justify-center mt-6">
                <MetricsPanel
                  adsYear1={validationErrors.length ? undefined : adsYear1}
                  dscrAtEvaluated={validationErrors.length ? undefined : dscrAtEvaluated}
                  evaluatedLoan={validationErrors.length ? undefined : bindingLoan}
                  disabled={validationErrors.length > 0}
                />
              </div>

              {/* Shock Chart */}
              <div className="mt-10">
                <ShockChart data={shockTable || []} disabled={validationErrors.length > 0} />
              </div>
            </form>
          </TooltipProvider>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full py-8 text-center text-xs text-gray-400 mt-10">
        <span>© {new Date().getFullYear()} Real Estate Stress-Tester &mdash; Built with Next.js, Tailwind, shadcn/ui, and ❤️</span>
      </footer>
    </div>
  );
}
