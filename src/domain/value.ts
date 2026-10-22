/**
 * Pure calculation functions for the Value Lab (Part B).
 * Deterministic math, integer minutes, and integer ETB cents.
 * No Math.random(), no scoring, no rankings, no forecasts.
 */

export interface BankLensInputs {
  eventsPerDay: number;
  minutesPerManualItem: number;
  staffCostPerHourETB: number;
  complaintSharePercent: number;
  bankAlreadySolvesIt: boolean;
}

export interface BankLensOutputs {
  baselineMatchRatePercent: number;
  manualItemsPerDayWithout: number;
  manualItemsPerDayWith: number;
  itemsSavedPerDay: number;
  itemsSavedPerMonth: number;
  hoursWithoutPerMonth: number;
  hoursWithPerMonth: number;
  hoursSavedPerMonth: number; // X
  complaintsAvoidedPerMonth: number; // Y
  monthlyStaffSavingsETBCents: number;
  bankValueCeilingETBCents: number; // Z (minor units)
  breakEvenSentence: string;
  isBankAlreadyGood: boolean;
}

export interface MerchantLensInputs {
  salesPerDay: number;
  minutesLostPerDispute: number;
  merchantAlreadyCopes: boolean;
}

export interface MerchantLensOutputs {
  timeToConfirmedWithout: string;
  timeToConfirmedWith: string;
  disputedSalesPerWeekWithout: number;
  disputedSalesPerWeekWith: number;
  shiftVarianceWithoutETBCents: number;
  shiftVarianceWithETBCents: number;
  timeToFindMissingSaleWithoutMin: number;
  timeToFindMissingSaleWithMin: number;
  hoursSavedPerMonth: number;
  merchantCopesActive: boolean;
}

export interface OperatorLensInputs {
  supportCostPerHourETB: number;
  fixedMonthlyRunCostETB: number;
  pricePerBankPerMonthETB: number;
  participatingBanksCount: number;
  bankValueCeilingETB: number;
}

export interface OperatorLensOutputs {
  exceptionVolumePerMonth: number;
  supportHoursPerMonth: number;
  supportCostPerMonthETBCents: number;
  fixedRunCostPerMonthETBCents: number;
  totalMonthlyCostETBCents: number;
  viablePriceFloorETBCents: number; // Minimum per bank
  bankValueCeilingETBCents: number; // Maximum bank will pay
  noPriceWorks: boolean;
  statusSentence: string;
  zeroBankAccrualMonths: Array<{ months: number; accruedCostETBCents: number }>;
}

export interface SystemInclusionMetrics {
  totalSampleEvents: number;
  microTransactionsCount: number; // <= 200 ETB
  microTransactionsSharePercent: number;
  merchantsWithContinuousRecord: number;
  observationPeriodWeeks: number;
}

export const computeBankLens = (inputs: BankLensInputs): BankLensOutputs => {
  const eventsPerDay = Math.max(1, Math.round(inputs.eventsPerDay));
  const minutesPerItem = Math.max(1, Math.round(inputs.minutesPerManualItem));
  const staffHourlyETB = Math.max(1, Math.round(inputs.staffCostPerHourETB));
  const complaintShare = Math.max(0, Math.min(100, inputs.complaintSharePercent));

  // If the bank already solves it internally, its baseline match rate is already ~99.5%
  const baselineMatchRate = inputs.bankAlreadySolvesIt ? 99.5 : 94.0;
  const layerMatchRate = 99.5;

  const unmatchedRateWithout = (100 - baselineMatchRate) / 100;
  const unmatchedRateWith = (100 - layerMatchRate) / 100;

  const manualItemsPerDayWithout = Math.round(eventsPerDay * unmatchedRateWithout);
  const manualItemsPerDayWith = Math.round(eventsPerDay * unmatchedRateWith);

  const itemsSavedPerDay = Math.max(0, manualItemsPerDayWithout - manualItemsPerDayWith);
  const itemsSavedPerMonth = itemsSavedPerDay * 30;

  const hoursWithoutPerMonth = Math.round((manualItemsPerDayWithout * 30 * minutesPerItem) / 60);
  const hoursWithPerMonth = Math.round((manualItemsPerDayWith * 30 * minutesPerItem) / 60);
  const hoursSavedPerMonth = Math.max(0, hoursWithoutPerMonth - hoursWithPerMonth);

  const complaintsAvoidedPerMonth = Math.round(itemsSavedPerMonth * (complaintShare / 100));

  const monthlyStaffSavingsETB = hoursSavedPerMonth * staffHourlyETB;
  // Estimated financial value ceiling Z: staff hours saved + modest cost-per-complaint resolution (e.g. 50 ETB/complaint)
  const bankValueCeilingETB = monthlyStaffSavingsETB + complaintsAvoidedPerMonth * 50;

  const ceilingFormatted = (bankValueCeilingETB).toLocaleString();

  const breakEvenSentence =
    `The layer is worth paying for only if it removes at least ${hoursSavedPerMonth} hours a month, or avoids at least ${complaintsAvoidedPerMonth} customer complaints a month, at a price below ETB ${ceilingFormatted}.`;

  return {
    baselineMatchRatePercent: baselineMatchRate,
    manualItemsPerDayWithout,
    manualItemsPerDayWith,
    itemsSavedPerDay,
    itemsSavedPerMonth,
    hoursWithoutPerMonth,
    hoursWithPerMonth,
    hoursSavedPerMonth,
    complaintsAvoidedPerMonth,
    monthlyStaffSavingsETBCents: monthlyStaffSavingsETB * 100,
    bankValueCeilingETBCents: bankValueCeilingETB * 100,
    breakEvenSentence,
    isBankAlreadyGood: inputs.bankAlreadySolvesIt,
  };
};

export const computeMerchantLens = (inputs: MerchantLensInputs): MerchantLensOutputs => {
  const salesPerDay = Math.max(1, Math.round(inputs.salesPerDay));
  const minutesLost = Math.max(1, Math.round(inputs.minutesLostPerDispute));

  // If merchant keeps paper records and already copes, disputes are low and shift variance is negligible
  const disputedSalesWithout = inputs.merchantAlreadyCopes ? 1 : Math.max(2, Math.round(salesPerDay * 0.05));
  const disputedSalesWith = 1;

  const shiftVarianceWithoutCents = inputs.merchantAlreadyCopes ? 5000 : 45000; // 50 ETB vs 450 ETB
  const shiftVarianceWithCents = 0; // Exactly reconciled

  const timeToFindWithout = inputs.merchantAlreadyCopes ? 8 : minutesLost;
  const timeToFindWith = 2; // Instant filter by reference

  const disputesSavedPerWeek = Math.max(0, disputedSalesWithout - disputedSalesWith);
  const hoursSavedPerMonth = Math.round((disputesSavedPerWeek * 4 * timeToFindWithout) / 60);

  return {
    timeToConfirmedWithout: 'T+1 statement (approx 1,440 min)',
    timeToConfirmedWith: '< 15 min (batch feed)',
    disputedSalesPerWeekWithout: disputedSalesWithout,
    disputedSalesPerWeekWith: disputedSalesWith,
    shiftVarianceWithoutETBCents: shiftVarianceWithoutCents,
    shiftVarianceWithETBCents: shiftVarianceWithCents,
    timeToFindMissingSaleWithoutMin: timeToFindWithout,
    timeToFindMissingSaleWithMin: timeToFindWith,
    hoursSavedPerMonth,
    merchantCopesActive: inputs.merchantAlreadyCopes,
  };
};

export const computeOperatorLens = (inputs: OperatorLensInputs): OperatorLensOutputs => {
  const supportRate = Math.max(1, Math.round(inputs.supportCostPerHourETB));
  const fixedRunCost = Math.max(0, Math.round(inputs.fixedMonthlyRunCostETB));
  const banksCount = Math.max(1, Math.round(inputs.participatingBanksCount));

  // Exception handling baseline
  const exceptionVolumePerMonth = 180; // Sample deterministic baseline
  const minutesPerException = 12;
  const supportHoursPerMonth = Math.round((exceptionVolumePerMonth * minutesPerException) / 60); // 36 hours
  const supportCostPerMonth = supportHoursPerMonth * supportRate;

  const totalMonthlyCost = fixedRunCost + supportCostPerMonth;
  // Lowest price per bank to break even (price floor)
  const viablePriceFloor = Math.round(totalMonthlyCost / banksCount);
  const bankValueCeiling = Math.round(inputs.bankValueCeilingETB);

  // Switching value rule: ceiling < floor means no price works on these inputs
  const noPriceWorks = bankValueCeiling < viablePriceFloor;

  const statusSentence = noPriceWorks
    ? 'No price works on these inputs. Option stops.'
    : `Viable pricing window: ETB ${viablePriceFloor.toLocaleString()} (cost floor) to ETB ${bankValueCeiling.toLocaleString()} (value ceiling) per bank/month.`;

  const zeroBankAccrualMonths = [
    { months: 1, accruedCostETBCents: fixedRunCost * 1 * 100 },
    { months: 3, accruedCostETBCents: fixedRunCost * 3 * 100 },
    { months: 6, accruedCostETBCents: fixedRunCost * 6 * 100 },
    { months: 12, accruedCostETBCents: fixedRunCost * 12 * 100 },
  ];

  return {
    exceptionVolumePerMonth,
    supportHoursPerMonth,
    supportCostPerMonthETBCents: supportCostPerMonth * 100,
    fixedRunCostPerMonthETBCents: fixedRunCost * 100,
    totalMonthlyCostETBCents: totalMonthlyCost * 100,
    viablePriceFloorETBCents: viablePriceFloor * 100,
    bankValueCeilingETBCents: bankValueCeiling * 100,
    noPriceWorks,
    statusSentence,
    zeroBankAccrualMonths,
  };
};

export const computeSystemInclusionMetrics = (events: Array<{ amountCents: number }>): SystemInclusionMetrics => {
  const total = events.length;
  if (total === 0) {
    return {
      totalSampleEvents: 0,
      microTransactionsCount: 0,
      microTransactionsSharePercent: 0,
      merchantsWithContinuousRecord: 12,
      observationPeriodWeeks: 4,
    };
  }

  // Micro-transactions defined as <= 200 ETB (20,000 cents)
  const microCount = events.filter((e) => e.amountCents <= 20000).length;
  const share = Math.round((microCount / total) * 100);

  return {
    totalSampleEvents: total,
    microTransactionsCount: microCount,
    microTransactionsSharePercent: share,
    merchantsWithContinuousRecord: 12, // Deterministic placeholder
    observationPeriodWeeks: 4,
  };
};
