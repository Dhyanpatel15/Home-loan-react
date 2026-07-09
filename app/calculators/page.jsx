'use client';

import { useMemo, useState } from 'react';

// Local lightweight icons. No external package needed.
function AppIcon({ symbol, size = 20, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-grid shrink-0 place-items-center leading-none ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(14, size - 3) }}
    >
      {symbol}
    </span>
  );
}

const Calculator = (props) => <AppIcon symbol="🧮" {...props} />;
const Home = (props) => <AppIcon symbol="🏠" {...props} />;
const RefreshCw = (props) => <AppIcon symbol="↻" {...props} />;
const UserRound = (props) => <AppIcon symbol="👤" {...props} />;
const TrendingUp = (props) => <AppIcon symbol="↗" {...props} />;
const Hammer = (props) => <AppIcon symbol="🔨" {...props} />;
const Building2 = (props) => <AppIcon symbol="🏢" {...props} />;
const Wallet = (props) => <AppIcon symbol="💳" {...props} />;
const ShieldCheck = (props) => <AppIcon symbol="✓" {...props} />;
const Landmark = (props) => <AppIcon symbol="🏦" {...props} />;
const ReceiptText = (props) => <AppIcon symbol="🧾" {...props} />;
const Percent = (props) => <AppIcon symbol="%" {...props} />;

const calculatorTabs = [
  { id: 'borrowing', label: 'Borrowing Power', icon: Wallet },
  { id: 'repayment', label: 'Repayment', icon: Calculator },
  { id: 'refinance', label: 'Refinance', icon: RefreshCw },
  { id: 'firstHomeBuyer', label: 'First Home Buyer', icon: UserRound },
  { id: 'investment', label: 'Investment', icon: TrendingUp },
  { id: 'construction', label: 'Construction', icon: Hammer },
  { id: 'propertyValue', label: 'Property Value', icon: Home },
  { id: 'offset', label: 'Offset', icon: Landmark },
  { id: 'equity', label: 'Equity', icon: Building2 },
  { id: 'lmi', label: 'LMI', icon: ShieldCheck },
  { id: 'stampDuty', label: 'Stamp Duty', icon: ReceiptText },
];

const initialInputs = {
  income: '95000',
  partnerIncome: '0',
  monthlyExpenses: '2800',
  dependents: '0',
  deposit: '120000',

  repaymentLoanAmount: '520000',
  repaymentRate: '6.14',
  repaymentYears: '30',

  refinanceBalance: '520000',
  currentRate: '6.89',
  newRate: '6.14',
  refinanceYears: '30',
  refinanceCosts: '1200',

  firstHomePrice: '650000',
  firstHomeDeposit: '130000',
  firstHomeState: 'Victoria',

  investmentPrice: '700000',
  investmentDeposit: '160000',
  investmentRate: '6.45',
  weeklyRent: '650',
  monthlyPropertyCosts: '650',

  landValue: '350000',
  buildCost: '420000',
  constructionDeposit: '160000',
  constructionRate: '6.7',

  targetSuburbPrice: '750000',

  offsetLoanAmount: '520000',
  offsetBalance: '50000',
  offsetRate: '6.14',
  offsetYears: '30',

  homeValue: '850000',
  currentLoanBalance: '520000',
  equityAccessPercent: '80',

  lmiPropertyValue: '650000',
  lmiDeposit: '65000',

  stampPropertyValue: '650000',
  stampState: 'Victoria',
  ownerOccupied: 'yes',
};

function toNumber(value) {
  const number = Number(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function money(value) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, toNumber(value)));
}

function percent(value, digits = 1) {
  const number = Number(value);
  return `${Number.isFinite(number) ? number.toFixed(digits) : '0.0'}%`;
}

function monthlyPayment(principal, annualRate, years) {
  const amount = toNumber(principal);
  const rate = toNumber(annualRate) / 100 / 12;
  const payments = toNumber(years) * 12;

  if (!amount || !payments) return 0;
  if (!rate) return amount / payments;

  return (
    (amount * rate * Math.pow(1 + rate, payments)) /
    (Math.pow(1 + rate, payments) - 1)
  );
}

function estimateStampDuty(price, state = 'Victoria', ownerOccupied = 'yes') {
  const amount = toNumber(price);

  if (!amount) return 0;

  // Simple planning estimate. Replace with exact state logic if required by your compliance team.
  if (state === 'Victoria') {
    let duty = 0;

    if (amount <= 25000) duty = amount * 0.014;
    else if (amount <= 130000) duty = 350 + (amount - 25000) * 0.024;
    else if (amount <= 960000) duty = 2870 + (amount - 130000) * 0.06;
    else duty = amount * 0.055;

    // Approximate first-home / owner-occupied planning concession range.
    if (ownerOccupied === 'yes' && amount <= 600000) duty = 0;
    if (ownerOccupied === 'yes' && amount > 600000 && amount <= 750000) {
      const discount = (750000 - amount) / 150000;
      duty = duty * (1 - Math.max(0, Math.min(1, discount)));
    }

    return Math.max(0, duty);
  }

  // General fallback estimate for other states.
  return amount * 0.045;
}

function estimateLmi(propertyValue, deposit) {
  const price = toNumber(propertyValue);
  const depositAmount = toNumber(deposit);
  const loan = Math.max(0, price - depositAmount);
  const lvr = price > 0 ? (loan / price) * 100 : 0;

  if (lvr <= 80) return 0;

  let rate = 0.008;
  if (lvr > 85) rate = 0.015;
  if (lvr > 90) rate = 0.028;
  if (lvr > 95) rate = 0.04;

  return loan * rate;
}

function InputField({ label, value, onChange, prefix = '$', suffix = '', type = 'number' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-slate-700">{label}</span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-2xl border border-slate-200 bg-white py-4 font-bold text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
            prefix ? 'pl-9 pr-4' : 'px-4'
          }`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-bold text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultCard({ label, value, helper, highlight = false }) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        highlight
          ? 'border-blue-200 bg-gradient-to-br from-blue-600 to-slate-950 text-white shadow-xl shadow-blue-100'
          : 'border-slate-200 bg-white text-slate-950 shadow-sm'
      }`}
    >
      <p className={`text-sm font-extrabold ${highlight ? 'text-blue-100' : 'text-slate-500'}`}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
      {helper && (
        <p className={`mt-2 text-sm leading-6 ${highlight ? 'text-blue-100' : 'text-slate-500'}`}>
          {helper}
        </p>
      )}
    </div>
  );
}

function TipBox({ children }) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold leading-7 text-amber-900">
      {children}
    </div>
  );
}

export default function CalculatorsPage() {
  const [active, setActive] = useState('borrowing');
  const [inputs, setInputs] = useState(initialInputs);

  const update = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const results = useMemo(() => {
    const totalIncome = toNumber(inputs.income) + toNumber(inputs.partnerIncome);
    const annualExpenses = toNumber(inputs.monthlyExpenses) * 12;
    const dependentBuffer = toNumber(inputs.dependents) * 5200;
    const availableAnnual = Math.max(0, totalIncome - annualExpenses - dependentBuffer);
    const availableMonthly = (availableAnnual / 12) * 0.34;
    const borrowingRate = 7.25 / 100 / 12;
    const borrowingMonths = 30 * 12;
    const borrowingPower =
      availableMonthly > 0
        ? (availableMonthly * (Math.pow(1 + borrowingRate, borrowingMonths) - 1)) /
          (borrowingRate * Math.pow(1 + borrowingRate, borrowingMonths))
        : 0;

    const repaymentMonthly = monthlyPayment(
      inputs.repaymentLoanAmount,
      inputs.repaymentRate,
      inputs.repaymentYears
    );
    const repaymentTotal = repaymentMonthly * toNumber(inputs.repaymentYears) * 12;

    const currentRefi = monthlyPayment(inputs.refinanceBalance, inputs.currentRate, inputs.refinanceYears);
    const newRefi = monthlyPayment(inputs.refinanceBalance, inputs.newRate, inputs.refinanceYears);
    const refiSaving = Math.max(0, currentRefi - newRefi);
    const breakEvenMonths = refiSaving > 0 ? toNumber(inputs.refinanceCosts) / refiSaving : 0;

    const firstHomeLoan = Math.max(0, toNumber(inputs.firstHomePrice) - toNumber(inputs.firstHomeDeposit));
    const firstHomeDuty = estimateStampDuty(inputs.firstHomePrice, inputs.firstHomeState, 'yes');

    const investmentLoan = Math.max(0, toNumber(inputs.investmentPrice) - toNumber(inputs.investmentDeposit));
    const investmentMonthlyRepayment = monthlyPayment(investmentLoan, inputs.investmentRate, 30);
    const monthlyRent = toNumber(inputs.weeklyRent) * 52 / 12;
    const investmentNet = monthlyRent - investmentMonthlyRepayment - toNumber(inputs.monthlyPropertyCosts);
    const rentalYield = toNumber(inputs.investmentPrice)
      ? (toNumber(inputs.weeklyRent) * 52 / toNumber(inputs.investmentPrice)) * 100
      : 0;

    const constructionTotal = toNumber(inputs.landValue) + toNumber(inputs.buildCost);
    const constructionLoan = Math.max(0, constructionTotal - toNumber(inputs.constructionDeposit));
    const interestOnlyMonthly = constructionLoan * (toNumber(inputs.constructionRate) / 100 / 12);

    const targetPrice = toNumber(inputs.targetSuburbPrice);
    const propertyDuty = estimateStampDuty(targetPrice, 'Victoria', 'no');

    const offsetMonthlyWithout = monthlyPayment(inputs.offsetLoanAmount, inputs.offsetRate, inputs.offsetYears);
    const offsetEffectiveLoan = Math.max(0, toNumber(inputs.offsetLoanAmount) - toNumber(inputs.offsetBalance));
    const offsetMonthlyWith = monthlyPayment(offsetEffectiveLoan, inputs.offsetRate, inputs.offsetYears);
    const offsetInterestSavedYear = toNumber(inputs.offsetBalance) * (toNumber(inputs.offsetRate) / 100);

    const currentEquity = Math.max(0, toNumber(inputs.homeValue) - toNumber(inputs.currentLoanBalance));
    const usableEquity = Math.max(
      0,
      toNumber(inputs.homeValue) * (toNumber(inputs.equityAccessPercent) / 100) -
        toNumber(inputs.currentLoanBalance)
    );
    const currentLvr = toNumber(inputs.homeValue)
      ? (toNumber(inputs.currentLoanBalance) / toNumber(inputs.homeValue)) * 100
      : 0;

    const lmiLoan = Math.max(0, toNumber(inputs.lmiPropertyValue) - toNumber(inputs.lmiDeposit));
    const lmiLvr = toNumber(inputs.lmiPropertyValue)
      ? (lmiLoan / toNumber(inputs.lmiPropertyValue)) * 100
      : 0;
    const lmiCost = estimateLmi(inputs.lmiPropertyValue, inputs.lmiDeposit);

    const stampDuty = estimateStampDuty(inputs.stampPropertyValue, inputs.stampState, inputs.ownerOccupied);
    const totalPurchaseCost = stampDuty + toNumber(inputs.stampPropertyValue) + 3000;

    return {
      borrowingPower,
      totalPurchaseBudget: borrowingPower + toNumber(inputs.deposit),
      repaymentMonthly,
      repaymentWeekly: repaymentMonthly * 12 / 52,
      repaymentFortnightly: repaymentMonthly * 12 / 26,
      repaymentTotalInterest: Math.max(0, repaymentTotal - toNumber(inputs.repaymentLoanAmount)),
      currentRefi,
      newRefi,
      refiSaving,
      breakEvenMonths,
      firstHomeLoan,
      firstHomeDuty,
      firstHomeLvr: toNumber(inputs.firstHomePrice) ? firstHomeLoan / toNumber(inputs.firstHomePrice) * 100 : 0,
      firstHomeCashNeeded: toNumber(inputs.firstHomeDeposit) + firstHomeDuty + 3000,
      investmentLoan,
      investmentMonthlyRepayment,
      monthlyRent,
      investmentNet,
      rentalYield,
      constructionTotal,
      constructionLoan,
      interestOnlyMonthly,
      targetPrice,
      deposit5: targetPrice * 0.05,
      deposit10: targetPrice * 0.1,
      deposit20: targetPrice * 0.2,
      propertyDuty,
      offsetMonthlyWithout,
      offsetMonthlyWith,
      offsetInterestSavedYear,
      currentEquity,
      usableEquity,
      currentLvr,
      lmiLoan,
      lmiLvr,
      lmiCost,
      stampDuty,
      totalPurchaseCost,
    };
  }, [inputs]);

  const activeTab = calculatorTabs.find((tab) => tab.id === active);
  const ActiveIcon = activeTab?.icon || Calculator;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-cyan-100">
              Smart mortgage planning tools
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Mortgage calculators for every home loan decision.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Calculate borrowing power, repayments, refinance savings, stamp duty, LMI, equity, offset benefits and more in one attractive dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[330px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70">
              <p className="px-3 pb-3 text-xs font-black uppercase tracking-[0.25em] text-blue-600">
                Calculator menu
              </p>
              <div className="grid gap-2">
                {calculatorTabs.map((tab) => {
                  const Icon = tab.icon;
                  const selected = active === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActive(tab.id)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                        selected
                          ? 'bg-slate-950 text-white shadow-lg'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-xl ${
                          selected ? 'bg-white/15 text-cyan-200' : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        <Icon size={20} />
                      </span>
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-[2rem] bg-gradient-to-br from-blue-600 to-slate-950 p-6 text-white shadow-xl shadow-blue-100">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-100">
                Current tool
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
                  <ActiveIcon size={24} />
                </span>
                <h2 className="text-2xl font-black">{activeTab?.label}</h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-blue-100">
                These are planning estimates only. Final eligibility, rates, fees and government charges can vary by lender, state and personal profile.
              </p>
            </div>
          </aside>

          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80 md:p-8">
            <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
                  {activeTab?.label}
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  {activeTab?.label} Calculator
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-5 py-3 text-sm font-black text-slate-700">
                Instant estimate
              </span>
            </div>

            {active === 'borrowing' && (
              <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField label="Your annual income" value={inputs.income} onChange={(v) => update('income', v)} />
                  <InputField label="Partner annual income" value={inputs.partnerIncome} onChange={(v) => update('partnerIncome', v)} />
                  <InputField label="Monthly living expenses" value={inputs.monthlyExpenses} onChange={(v) => update('monthlyExpenses', v)} />
                  <InputField label="Dependents" value={inputs.dependents} onChange={(v) => update('dependents', v)} prefix="" />
                  <InputField label="Deposit available" value={inputs.deposit} onChange={(v) => update('deposit', v)} />
                </div>
                <div className="space-y-4">
                  <ResultCard label="Estimated borrowing power" value={money(results.borrowingPower)} highlight />
                  <ResultCard label="Estimated purchase budget" value={money(results.totalPurchaseBudget)} helper="Borrowing estimate + available deposit." />
                </div>
              </div>
            )}

            {active === 'repayment' && (
              <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
                <div className="grid gap-5 md:grid-cols-3">
                  <InputField label="Loan amount" value={inputs.repaymentLoanAmount} onChange={(v) => update('repaymentLoanAmount', v)} />
                  <InputField label="Interest rate" value={inputs.repaymentRate} onChange={(v) => update('repaymentRate', v)} prefix="" suffix="%" />
                  <InputField label="Loan term" value={inputs.repaymentYears} onChange={(v) => update('repaymentYears', v)} prefix="" suffix="yrs" />
                </div>
                <div className="space-y-4">
                  <ResultCard label="Monthly repayment" value={money(results.repaymentMonthly)} highlight />
                  <ResultCard label="Fortnightly repayment" value={money(results.repaymentFortnightly)} />
                  <ResultCard label="Weekly repayment" value={money(results.repaymentWeekly)} />
                  <ResultCard label="Total interest estimate" value={money(results.repaymentTotalInterest)} />
                </div>
              </div>
            )}

            {active === 'refinance' && (
              <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField label="Current loan balance" value={inputs.refinanceBalance} onChange={(v) => update('refinanceBalance', v)} />
                  <InputField label="Current interest rate" value={inputs.currentRate} onChange={(v) => update('currentRate', v)} prefix="" suffix="%" />
                  <InputField label="New interest rate" value={inputs.newRate} onChange={(v) => update('newRate', v)} prefix="" suffix="%" />
                  <InputField label="Remaining loan term" value={inputs.refinanceYears} onChange={(v) => update('refinanceYears', v)} prefix="" suffix="yrs" />
                  <InputField label="Refinance cost estimate" value={inputs.refinanceCosts} onChange={(v) => update('refinanceCosts', v)} />
                </div>
                <div className="space-y-4">
                  <ResultCard label="Estimated monthly saving" value={money(results.refiSaving)} highlight />
                  <ResultCard label="Current repayment" value={money(results.currentRefi)} />
                  <ResultCard label="New repayment" value={money(results.newRefi)} />
                  <ResultCard label="Break-even time" value={`${Math.ceil(results.breakEvenMonths || 0)} months`} />
                </div>
              </div>
            )}

            {active === 'firstHomeBuyer' && (
              <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField label="Property price" value={inputs.firstHomePrice} onChange={(v) => update('firstHomePrice', v)} />
                  <InputField label="Deposit saved" value={inputs.firstHomeDeposit} onChange={(v) => update('firstHomeDeposit', v)} />
                  <SelectField label="State" value={inputs.firstHomeState} onChange={(v) => update('firstHomeState', v)} options={['Victoria', 'New South Wales', 'Queensland', 'South Australia', 'Western Australia', 'Tasmania', 'ACT', 'Northern Territory']} />
                </div>
                <div className="space-y-4">
                  <ResultCard label="Loan amount needed" value={money(results.firstHomeLoan)} highlight />
                  <ResultCard label="Estimated LVR" value={percent(results.firstHomeLvr)} />
                  <ResultCard label="Stamp duty estimate" value={money(results.firstHomeDuty)} />
                  <ResultCard label="Cash needed estimate" value={money(results.firstHomeCashNeeded)} helper="Deposit + estimated duty + basic purchase costs." />
                </div>
              </div>
            )}

            {active === 'investment' && (
              <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField label="Investment property price" value={inputs.investmentPrice} onChange={(v) => update('investmentPrice', v)} />
                  <InputField label="Deposit" value={inputs.investmentDeposit} onChange={(v) => update('investmentDeposit', v)} />
                  <InputField label="Interest rate" value={inputs.investmentRate} onChange={(v) => update('investmentRate', v)} prefix="" suffix="%" />
                  <InputField label="Expected weekly rent" value={inputs.weeklyRent} onChange={(v) => update('weeklyRent', v)} />
                  <InputField label="Monthly property costs" value={inputs.monthlyPropertyCosts} onChange={(v) => update('monthlyPropertyCosts', v)} />
                </div>
                <div className="space-y-4">
                  <ResultCard label="Monthly cash flow estimate" value={money(results.investmentNet)} highlight />
                  <ResultCard label="Loan amount" value={money(results.investmentLoan)} />
                  <ResultCard label="Monthly rent" value={money(results.monthlyRent)} />
                  <ResultCard label="Gross rental yield" value={percent(results.rentalYield)} />
                </div>
              </div>
            )}

            {active === 'construction' && (
              <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField label="Land value" value={inputs.landValue} onChange={(v) => update('landValue', v)} />
                  <InputField label="Build cost" value={inputs.buildCost} onChange={(v) => update('buildCost', v)} />
                  <InputField label="Deposit available" value={inputs.constructionDeposit} onChange={(v) => update('constructionDeposit', v)} />
                  <InputField label="Construction rate" value={inputs.constructionRate} onChange={(v) => update('constructionRate', v)} prefix="" suffix="%" />
                </div>
                <div className="space-y-4">
                  <ResultCard label="Total project cost" value={money(results.constructionTotal)} highlight />
                  <ResultCard label="Construction loan needed" value={money(results.constructionLoan)} />
                  <ResultCard label="Interest-only monthly estimate" value={money(results.interestOnlyMonthly)} />
                </div>
              </div>
            )}

            {active === 'propertyValue' && (
              <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
                <div className="space-y-5">
                  <InputField label="Target property value" value={inputs.targetSuburbPrice} onChange={(v) => update('targetSuburbPrice', v)} />
                  <TipBox>
                    Use this tool to quickly understand how much deposit and purchase cost may be required for a target property value.
                  </TipBox>
                </div>
                <div className="space-y-4">
                  <ResultCard label="5% deposit" value={money(results.deposit5)} />
                  <ResultCard label="10% deposit" value={money(results.deposit10)} />
                  <ResultCard label="20% deposit" value={money(results.deposit20)} highlight />
                  <ResultCard label="Stamp duty estimate" value={money(results.propertyDuty)} />
                </div>
              </div>
            )}

            {active === 'offset' && (
              <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField label="Loan amount" value={inputs.offsetLoanAmount} onChange={(v) => update('offsetLoanAmount', v)} />
                  <InputField label="Offset balance" value={inputs.offsetBalance} onChange={(v) => update('offsetBalance', v)} />
                  <InputField label="Interest rate" value={inputs.offsetRate} onChange={(v) => update('offsetRate', v)} prefix="" suffix="%" />
                  <InputField label="Loan term" value={inputs.offsetYears} onChange={(v) => update('offsetYears', v)} prefix="" suffix="yrs" />
                </div>
                <div className="space-y-4">
                  <ResultCard label="Interest saved in first year" value={money(results.offsetInterestSavedYear)} highlight />
                  <ResultCard label="Repayment without offset" value={money(results.offsetMonthlyWithout)} />
                  <ResultCard label="Effective repayment estimate" value={money(results.offsetMonthlyWith)} helper="Shown as if offset reduced the interest-bearing balance." />
                </div>
              </div>
            )}

            {active === 'equity' && (
              <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField label="Estimated home value" value={inputs.homeValue} onChange={(v) => update('homeValue', v)} />
                  <InputField label="Current loan balance" value={inputs.currentLoanBalance} onChange={(v) => update('currentLoanBalance', v)} />
                  <InputField label="Access up to" value={inputs.equityAccessPercent} onChange={(v) => update('equityAccessPercent', v)} prefix="" suffix="%" />
                </div>
                <div className="space-y-4">
                  <ResultCard label="Usable equity estimate" value={money(results.usableEquity)} highlight />
                  <ResultCard label="Total equity" value={money(results.currentEquity)} />
                  <ResultCard label="Current LVR" value={percent(results.currentLvr)} />
                </div>
              </div>
            )}

            {active === 'lmi' && (
              <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField label="Property value" value={inputs.lmiPropertyValue} onChange={(v) => update('lmiPropertyValue', v)} />
                  <InputField label="Deposit amount" value={inputs.lmiDeposit} onChange={(v) => update('lmiDeposit', v)} />
                </div>
                <div className="space-y-4">
                  <ResultCard label="Estimated LMI cost" value={money(results.lmiCost)} highlight />
                  <ResultCard label="Loan amount" value={money(results.lmiLoan)} />
                  <ResultCard label="Estimated LVR" value={percent(results.lmiLvr)} />
                  <ResultCard label="LMI status" value={results.lmiLvr <= 80 ? 'Likely not required' : 'Likely required'} />
                </div>
              </div>
            )}

            {active === 'stampDuty' && (
              <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField label="Property value" value={inputs.stampPropertyValue} onChange={(v) => update('stampPropertyValue', v)} />
                  <SelectField label="State" value={inputs.stampState} onChange={(v) => update('stampState', v)} options={['Victoria', 'New South Wales', 'Queensland', 'South Australia', 'Western Australia', 'Tasmania', 'ACT', 'Northern Territory']} />
                  <SelectField label="Owner occupied / first home estimate" value={inputs.ownerOccupied} onChange={(v) => update('ownerOccupied', v)} options={['yes', 'no']} />
                </div>
                <div className="space-y-4">
                  <ResultCard label="Stamp duty estimate" value={money(results.stampDuty)} highlight />
                  <ResultCard label="Basic purchase cost estimate" value={money(results.totalPurchaseCost)} helper="Property value + estimated duty + approx. $3,000 basic costs." />
                </div>
              </div>
            )}

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-100 text-blue-700">
                  <Percent size={20} />
                </span>
                <p className="text-sm font-semibold leading-7 text-slate-600">
                  Calculator results are estimates for planning and lead-generation use only. Please review formulas with your broker, lender, accountant or compliance team before using them as official financial advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
