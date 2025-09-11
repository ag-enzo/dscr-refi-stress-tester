import type { LoanInputs, ShockConfig, ShockRow } from "../types/finance";

// Amortizing monthly payment (PMT)
export function pmtAmort(principal: number, rMonthly: number, nMonths: number): number {
	if (principal <= 0 || nMonths <= 0) return 0;
	if (Math.abs(rMonthly) < 1e-12) {
		return principal / nMonths;
	}
	// Standard amortizing payment formula: PMT = P * [r * (1 + r)^n] / [(1 + r)^n - 1]
	const pow = Math.pow(1 + rMonthly, nMonths);
	return principal * rMonthly * pow / (pow - 1);
}

// Year-1 Annual Debt Service (ADS)
export function annualDebtService(principal: number, rateAnnualPct: number, amortYears: number, ioYears: number): number {
	if (principal <= 0 || amortYears < 1) return 0;
	const rMonthly = rateAnnualPct / 100 / 12;
	const nMonths = amortYears * 12;
	if (ioYears > 0 && rMonthly > 0) {
		return 12 * principal * rMonthly;
	}
	return 12 * pmtAmort(principal, rMonthly, nMonths);
}

// Size loan by DSCR (Year-1 basis)
export function sizeLoanByDSCR(noiAnnual: number, rateAnnualPct: number, amortYears: number, ioYears: number, targetDSCR: number): number {
	if (noiAnnual <= 0 || amortYears < 1 || targetDSCR <= 0) return 0;
	const rMonthly = rateAnnualPct / 100 / 12;
	const nMonths = amortYears * 12;
	if (ioYears > 0 && rMonthly > 0) {
		return noiAnnual / (targetDSCR * 12 * rMonthly);
	}
	const monthlyCap = noiAnnual / (targetDSCR * 12);
	if (Math.abs(rMonthly) < 1e-12) {
		return monthlyCap * nMonths;
	}
	return monthlyCap * (1 - Math.pow(1 + rMonthly, -nMonths)) / rMonthly;
}

// Size loan by LTV
export function sizeLoanByLTV(value: number, ltvMaxPct: number): number {
	if (value <= 0 || ltvMaxPct <= 0) return 0;
	return (ltvMaxPct / 100) * value;
}

// Debt Yield (DY)
export function debtYield(noiAnnual: number, loan: number): number {
	if (loan <= 0) return 0;
	return noiAnnual / loan;
}

// Break-even occupancy (DSCR=1)
export function breakEvenOccupancy(ads: number, pgi: number, fixed: number, varRatio: number): number | undefined {
	if (pgi <= 0 || varRatio >= 1) return undefined;
	const occ = (ads + fixed) / (pgi * (1 - varRatio));
	if (isNaN(occ) || !isFinite(occ)) return undefined;
	return Math.max(0, Math.min(1, occ));
}

// Build shock table for rate sensitivity (±windowBps, stepBps)

export function buildShockTable(inputs: LoanInputs, cfg: ShockConfig): ShockRow[] {
	const {
		annualNOI,
		interestRate,
		amortizationYears,
		interestOnlyYears,
		propertyValue,
		ltvMaxPct,
		targetDSCR,
	} = inputs;
	const minRate = cfg.minRate ?? interestRate - 2;
	const maxRate = cfg.maxRate ?? interestRate + 2;
	const step = cfg.step ?? 0.25;
	const rows: ShockRow[] = [];
	for (let rate = minRate; rate <= maxRate + 1e-8; rate += step) {
		const maxLoanDSCR = sizeLoanByDSCR(
			annualNOI,
			rate,
			amortizationYears,
			interestOnlyYears,
			targetDSCR
		);
		const maxLoanLTV = sizeLoanByLTV(propertyValue, ltvMaxPct);
		const maxLoanBinding = Math.min(maxLoanDSCR, maxLoanLTV);
		const payment = annualDebtService(maxLoanBinding, rate, amortizationYears, interestOnlyYears);
		const dscr = payment > 0 ? annualNOI / payment : 0;
		const ltv = propertyValue > 0 ? maxLoanBinding / propertyValue : 0;
		const dy = maxLoanBinding > 0 ? annualNOI / maxLoanBinding : 0;
		rows.push({
			rate,
			dscr,
			ltv,
			debtYield: dy,
			payment,
			// The following are not part of ShockRow, but may be useful for charting. Remove if not needed.
			// maxLoanDSCR,
			// maxLoanLTV,
			// maxLoanBinding,
		} as ShockRow);
	}
	return rows;
}
