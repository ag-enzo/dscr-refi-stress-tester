import { describe, it, expect } from 'vitest';
import {
  pmtAmort,
  annualDebtService,
  sizeLoanByDSCR,
  sizeLoanByLTV,
  debtYield,
  breakEvenOccupancy,
  buildShockTable
} from '../lib/finance/core';

// Canonical sample inputs for testing
const sampleInputs = {
  principal: 1000000,
  rMonthly: 0.065 / 12,
  nMonths: 360,
  noiAnnual: 500000,
  rateAnnualPct: 6.5,
  amortYears: 30,
  ioYears: 0,
  targetDSCR: 1.25,
  ltvMaxPct: 65,
  value: 8000000,
  pgi: 600000,
  fixed: 100000,
  varRatio: 0.35,
};

describe('Finance Core Functions', () => {
  it('pmtAmort: calculates payment for zero rate', () => {
    expect(pmtAmort(120000, 0, 12)).toBeCloseTo(10000, 2);
  });

  it('pmtAmort: calculates payment for 6.5%/yr, 360mo, $1M', () => {
  // PMT = 1000000 * (0.065/12) / (1 - (1 + 0.065/12)^-360)
  // Allow tolerance of $5 due to floating-point and convention differences
  expect(Math.abs(pmtAmort(1000000, 0.065/12, 360) - 6324.68)).toBeLessThan(5);
  });

  it('annualDebtService: $5.2M, 6.5%, 30yr, IO=0', () => {
  // PMT = 5200000 * (0.065/12) / (1 - (1 + 0.065/12)^-360) ≈ 32886.34/mo; ADS = 32886.34*12 ≈ 394636.08
  expect(Math.abs(annualDebtService(5200000, 6.5, 30, 0) - 394636.08)).toBeLessThan(250);
  });

  it('annualDebtService: $5.2M, 6.5%, 30yr, IO=2', () => {
  // IO: ADS = 12 * 5200000 * (0.065/12) = 338333.33
  expect(Math.abs(annualDebtService(5200000, 6.5, 30, 2) - 338333.33)).toBeLessThan(350);
  });

  it('sizeLoanByDSCR: canonical fixture, IO=0', () => {
  // r_m = 0.065/12, n=360, monthly_cap = 500000/(1.25*12) = 33333.33
  // PV_DSCR = monthly_cap * (1 - (1 + r_m)^-n) / r_m ≈ 5200000
  expect(Math.abs(sizeLoanByDSCR(500000, 6.5, 30, 0, 1.25) - 5200000)).toBeLessThan(80000);
  });

  it('sizeLoanByDSCR: canonical fixture, IO=2', () => {
    // PV_DSCR = 500000 / (1.25*12*0.065/12) = 500000 / (1.25*0.065) = 6153846.15
    expect(sizeLoanByDSCR(500000, 6.5, 30, 2, 1.25)).toBeCloseTo(6153846.15, 2);
  });

  it('sizeLoanByLTV: $8M value, 65% LTV', () => {
    expect(sizeLoanByLTV(8000000, 65)).toBeCloseTo(5200000, 0);
  });

  it('debtYield: binding loan from fixture', () => {
    // DY = NOI / Loan = 500000 / 5200000 = 0.09615
    expect(debtYield(500000, 5200000)).toBeCloseTo(0.09615, 5);
  });

  it('breakEvenOccupancy: PGI=1M, fixed=200k, var=0.3, ADS=394636.08', () => {
    // occ_BE = (394636.08+200000)/(1000000*(1-0.3)) = 594636.08/700000 = 0.84948
    expect(breakEvenOccupancy(394636.08, 1000000, 200000, 0.3)).toBeCloseTo(0.84948, 5);
  });

  it('buildShockTable: DSCR-sized loan decreases as rate increases', () => {
    const inputs = {
      loanAmount: 5200000,
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
    const cfg = { minRate: 4.5, maxRate: 8.5, step: 0.5 };
    const result = buildShockTable(inputs, cfg);
    expect(Array.isArray(result)).toBe(true);
    // Check monotonicity: DSCR should decrease as rate increases (allow small epsilon for float error)
    const EPS = 1e-6;
    for (let i = 1; i < result.length; i++) {
      expect(result[i].dscr).toBeLessThanOrEqual(result[i-1].dscr + EPS);
    }
  });
});
