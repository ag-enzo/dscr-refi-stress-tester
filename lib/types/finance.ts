
/**
 * LoanInputs: All user-provided loan sizing and property inputs
 */
export interface LoanInputs {
  loanAmount: number; // Requested loan amount ($)
  interestRate: number; // Quoted interest rate (%)
  amortizationYears: number; // Amortization period (years)
  interestOnlyYears: number; // Interest-only period (years)
  termYears: number; // Loan term (years)
  annualNOI: number; // Net Operating Income ($/yr)
  annualTaxes: number; // Property taxes ($/yr)
  annualInsurance: number; // Insurance ($/yr)
  annualOther: number; // Other expenses ($/yr)
  propertyValue: number; // Appraised value ($)
  ltvMaxPct: number; // LTV cap (%)
  targetDSCR: number; // Target DSCR
}

/**
 * ShockConfig: Parameters for rate shock analysis
 */
export interface ShockConfig {
	minRate: number; // Minimum rate for shock curve (%)
	maxRate: number; // Maximum rate for shock curve (%)
	step: number;    // Step size for shock curve (%)
}

/**
 * ShockRow: Single row in the rate shock table/curve
 */
export interface ShockRow {
	rate: number; // Interest rate (%)
	dscr: number; // DSCR at this rate
	ltv: number;  // LTV at this rate
	debtYield: number; // Debt Yield at this rate
	payment: number; // Annual debt service ($/yr)
}

/**
 * LoanResults: Output of loan sizing and stress test
 */
export interface LoanResults {
	dscr: number;
	ltv: number;
	debtYield: number;
	payment: number;
	year1ADS: number;
	shockTable: ShockRow[];
}

/**
 * Type guard for LoanInputs. Returns an array of error messages if invalid, empty if valid.
 * (Signature only, implementation TODO)
 */
export function validateLoanInputs(i: LoanInputs): string[] {
		const errors: string[] = [];
		if (i.loanAmount !== undefined && i.loanAmount < 0) errors.push('Loan amount must be ≥ 0');
		if (i.interestRate !== undefined && i.interestRate < 0) errors.push('Interest rate must be ≥ 0');
		if (i.amortizationYears !== undefined && i.amortizationYears < 1) errors.push('Amortization must be ≥ 1 year');
		if (i.interestOnlyYears !== undefined && i.interestOnlyYears < 0) errors.push('Interest-only years must be ≥ 0');
		if (i.termYears !== undefined && i.termYears < 1) errors.push('Term must be ≥ 1 year');
		if (i.annualNOI !== undefined && i.annualNOI < 0) errors.push('NOI must be ≥ 0');
		if (i.annualTaxes !== undefined && i.annualTaxes < 0) errors.push('Taxes must be ≥ 0');
		if (i.annualInsurance !== undefined && i.annualInsurance < 0) errors.push('Insurance must be ≥ 0');
		if (i.annualOther !== undefined && i.annualOther < 0) errors.push('Other expenses must be ≥ 0');
		if (i.propertyValue !== undefined && i.propertyValue < 0) errors.push('Property value must be ≥ 0');
		if (i.ltvMaxPct !== undefined && (i.ltvMaxPct <= 0 || i.ltvMaxPct > 100)) errors.push('LTV max (%) must be between 1 and 100');
		if (i.targetDSCR !== undefined && i.targetDSCR < 1) errors.push('Target DSCR must be ≥ 1.00');
		// Business logic: IO years cannot exceed amortization or term
		if (i.interestOnlyYears !== undefined && i.amortizationYears !== undefined && i.interestOnlyYears > i.amortizationYears) {
			errors.push('Interest-only years cannot exceed amortization period');
		}
		if (i.interestOnlyYears !== undefined && i.termYears !== undefined && i.interestOnlyYears > i.termYears) {
			errors.push('Interest-only years cannot exceed loan term');
		}
		return errors;
}

export {};
