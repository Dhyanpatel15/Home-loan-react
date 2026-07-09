'use client';

import { useMemo, useState } from 'react';

const steps = [
  { title: 'Loan Goal', subtitle: 'What do you want to do?' },
  { title: 'Property', subtitle: 'Tell us about the property.' },
  { title: 'Loan Size', subtitle: 'Estimate your purchase and deposit.' },
  { title: 'Income', subtitle: 'Help us understand your profile.' },
  { title: 'Preferences', subtitle: 'Choose what matters most.' },
  { title: 'Contact', subtitle: 'Receive your match summary.' },
];

const loanPurposeOptions = [
  { value: 'first-home', title: 'Buy my first home', text: 'I am entering the property market.' },
  { value: 'next-home', title: 'Buy my next home', text: 'I am upgrading or moving.' },
  { value: 'refinance', title: 'Refinance my loan', text: 'I want a better rate or features.' },
  { value: 'investment', title: 'Investment property', text: 'I want to buy or refinance an investment.' },
  { value: 'construction', title: 'Build a home', text: 'I need a construction loan option.' },
  { value: 'equity-release', title: 'Use home equity', text: 'I want to unlock equity for another goal.' },
];

const propertyStatusOptions = [
  { value: 'found', title: 'I found a property', text: 'I am ready to compare loan options.' },
  { value: 'searching', title: 'Still searching', text: 'I want to understand my borrowing range.' },
  { value: 'owned', title: 'I already own it', text: 'I am reviewing or refinancing my current loan.' },
];

const timelineOptions = ['Immediately', '1-3 months', '3-6 months', '6+ months'];
const stateOptions = ['Victoria', 'New South Wales', 'Queensland', 'South Australia', 'Western Australia', 'Tasmania', 'ACT', 'Northern Territory'];
const employmentOptions = ['Full-time employed', 'Part-time employed', 'Self-employed', 'Contractor', 'Retired', 'Other'];
const creditOptions = ['Excellent', 'Good', 'Average', 'Needs improvement', 'Not sure'];

const preferenceOptions = [
  { value: 'lowest-rate', title: 'Lowest interest rate' },
  { value: 'low-fee', title: 'Low or no fees' },
  { value: 'offset', title: 'Offset account' },
  { value: 'redraw', title: 'Redraw facility' },
  { value: 'fixed', title: 'Fixed rate option' },
  { value: 'variable', title: 'Variable flexibility' },
  { value: 'fast-approval', title: 'Fast approval' },
  { value: 'broker-help', title: 'Expert broker support' },
];

const matchedLenders = [
  { name: 'ING Smart Saver Home Loan', rate: '5.99%', fee: '$0 annual fee', tag: 'Low rate match' },
  { name: 'Westpac Flexi Choice', rate: '6.14%', fee: '$50 annual fee', tag: 'Feature rich' },
  { name: 'Commonwealth Complete Loan', rate: '6.24%', fee: '$0 annual fee', tag: 'Popular lender' },
];

const liveTrackingItems = [
  { label: 'About you', detail: 'Choose your loan goal', stepIndex: 0 },
  { label: 'Property', detail: 'Property status and location', stepIndex: 1 },
  { label: 'Loan details', detail: 'Value, deposit and loan amount', stepIndex: 2 },
  { label: 'Income', detail: 'Employment and income profile', stepIndex: 3 },
  { label: 'Preferences', detail: 'Select important loan features', stepIndex: 4 },
  { label: 'Compare', detail: 'Contact details and submit', stepIndex: 5 },
];

const initialForm = {
  loanPurpose: '',
  propertyStatus: '',
  state: 'Victoria',
  suburb: '',
  timeline: '',
  propertyValue: '650000',
  deposit: '130000',
  loanAmount: '520000',
  firstHomeBuyer: 'yes',
  employment: '',
  income: '90000',
  secondIncome: '',
  dependents: '0',
  creditScore: '',
  preferences: [],
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bestTime: 'Anytime',
  consent: false,
};

function numberValue(value) {
  const parsed = Number(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function currency(value) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(numberValue(value));
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function ChoiceCard({ selected, title, text, onClick, type = 'radio' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative rounded-[1.6rem] border-2 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-soft ${
        selected
          ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-100'
          : 'border-slate-200 bg-white hover:border-blue-300'
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`mt-1 grid h-7 w-7 shrink-0 place-items-center border-2 font-black ${
            type === 'checkbox' ? 'rounded-lg' : 'rounded-full'
          } ${selected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-transparent'}`}
        >
          ✓
        </span>
        <span>
          <span className="block text-base font-black text-slate-950">{title}</span>
          {text && <span className="mt-1 block text-sm leading-6 text-slate-600">{text}</span>}
        </span>
      </div>
    </button>
  );
}


function LiveTracker({ step, progress }) {
  const completedCount = liveTrackingItems.filter((item) => item.stepIndex < step).length;
  const currentItem = liveTrackingItems.find((item) => item.stepIndex === step);

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-[2.2rem] bg-white shadow-soft">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 p-6 text-white">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Live tracking</p>
          <h3 className="mt-3 text-2xl font-black">Application progress</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Follow each action as you complete your comparison request.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-300">
              <span>{progress}% complete</span>
              <span>{completedCount} of {liveTrackingItems.length} done</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1 p-4">
          {liveTrackingItems.map((item, index) => {
            const isCompleted = item.stepIndex < step;
            const isActive = item.stepIndex === step;

            return (
              <div
                key={item.label}
                className={`relative flex w-full items-start gap-4 rounded-2xl p-4 text-left transition ${
                  isActive
                    ? 'bg-blue-50 ring-2 ring-blue-100'
                    : isCompleted
                      ? 'bg-emerald-50'
                      : 'bg-white'
                }`}
              >
                <span className="relative flex flex-col items-center">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full text-sm font-black ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </span>
                  {index < liveTrackingItems.length - 1 && (
                    <span
                      className={`mt-2 h-8 w-0.5 rounded-full ${
                        isCompleted ? 'bg-emerald-300' : isActive ? 'bg-blue-300' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </span>

                <span className="min-w-0 flex-1 pt-1">
                  <span
                    className={`block text-sm font-black ${
                      isActive ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{item.detail}</span>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? 'Completed' : isActive ? 'In progress' : 'Pending'}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-100 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Current action</p>
          <p className="mt-2 text-sm font-black text-slate-900">{currentItem?.label || 'Compare'}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Complete this section and click Continue to move to the next step.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default function ComparePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadResult, setLeadResult] = useState(null);

  const propertyValue = numberValue(form.propertyValue);
  const loanAmount = numberValue(form.loanAmount);
  const deposit = numberValue(form.deposit);
  const totalIncome = numberValue(form.income) + numberValue(form.secondIncome);
  const lvr = propertyValue > 0 ? Math.round((loanAmount / propertyValue) * 100) : 0;
  const depositPercent = propertyValue > 0 ? Math.round((deposit / propertyValue) * 100) : 0;

  const monthlyRepayment = useMemo(() => {
    const rate = 6.14 / 100 / 12;
    const payments = 30 * 12;
    if (!loanAmount) return 0;
    return (loanAmount * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
  }, [loanAmount]);

  const progress = Math.round(((step + 1) / steps.length) * 100);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const togglePreference = (value) => {
    setForm((prev) => {
      const exists = prev.preferences.includes(value);
      return {
        ...prev,
        preferences: exists
          ? prev.preferences.filter((item) => item !== value)
          : [...prev.preferences, value],
      };
    });
    setError('');
  };

  const validateStep = () => {
    const messages = [
      !form.loanPurpose && 'Please select your loan goal.',
      (!form.propertyStatus || !form.state || !form.timeline) && 'Please complete property status, state, and timeline.',
      (!form.propertyValue || !form.deposit || !form.loanAmount) && 'Please add property value, deposit, and loan amount.',
      (!form.employment || !form.income || !form.creditScore) && 'Please add employment, income, and credit score range.',
      form.preferences.length === 0 && 'Please select at least one loan preference.',
      (!form.firstName || !form.lastName || !form.email || !form.phone || !form.consent) && 'Please complete your contact details and accept consent.',
    ];

    const message = messages[step];
    if (message) {
      setError(message);
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => {
    setError('');
    setStep((current) => Math.max(current - 1, 0));
  };

  const submitLead = async (event) => {
    event.preventDefault();
    if (!validateStep()) return;

    const lead = {
      ...form,
      summary: {
        lvr,
        depositPercent,
        estimatedMonthlyRepayment: Math.round(monthlyRepayment),
      },
    };

    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Something went wrong while submitting your enquiry.');
      }

      setLeadResult(result);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (submitError) {
      setError(submitError.message || 'Unable to submit right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const restart = () => {
    setForm(initialForm);
    setStep(0);
    setSubmitted(false);
    setError('');
    setLeadResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-14 text-white sm:pb-24 sm:pt-20">
        <div className="absolute inset-0 bg-hero-grid bg-[length:26px_26px] opacity-30" />
        <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="container-shell relative text-center">
          <p className="mx-auto mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
            Free comparison request • No obligation
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Compare home loan options in simple steps.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Answer a few checkbox-style questions and get a cleaner, faster path to loan options that match your needs.
          </p>
        </div>
      </section>

      <section className="container-shell relative z-10 py-10 lg:py-14">
        {submitted ? (
          <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-white p-8 text-center shadow-soft md:p-12">
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-4xl text-emerald-700">✓</div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-600">Request Submitted</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Thank you, {form.firstName || 'there'}!</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Your loan comparison enquiry has been saved in the database. We have also triggered the Phase 1 email notification flow.
            </p>

            {leadResult?.leadId && (
              <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-left">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Lead tracking</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-bold text-slate-500">Lead ID</p>
                    <p className="mt-1 text-sm font-black text-slate-950">{leadResult.leadId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Database</p>
                    <p className="mt-1 text-sm font-black text-emerald-700">Saved</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Email</p>
                    <p className="mt-1 text-sm font-black text-slate-950">{leadResult.email?.status || 'configured when ENV is added'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {matchedLenders.map((lender) => (
                <div key={lender.name} className="rounded-3xl border border-slate-200 p-5 text-left">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{lender.tag}</span>
                  <h3 className="mt-4 font-black text-slate-950">{lender.name}</h3>
                  <p className="mt-2 text-3xl font-black text-blue-600">{lender.rate}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{lender.fee}</p>
                </div>
              ))}
            </div>

            <button onClick={restart} className="mt-8 rounded-full bg-slate-950 px-8 py-4 font-black text-white hover:bg-blue-700">
              Start New Comparison
            </button>
          </div>
        ) : (
          <form onSubmit={submitLead} className="grid items-start gap-8 lg:grid-cols-[310px_minmax(0,1fr)]">
            <LiveTracker step={step} progress={progress} />

            <div className="min-w-0 rounded-[2.5rem] bg-white p-5 shadow-soft md:p-8">
              <div className="mb-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">Step {step + 1} of {steps.length}</p>
                    <h2 className="mt-2 text-3xl font-black text-slate-950">{steps[step].title}</h2>
                    <p className="mt-1 text-slate-500">{steps[step].subtitle}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-5 py-3 text-sm font-black text-slate-700">{progress}% Complete</span>
                </div>
                <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {error && (
                <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
                  {error}
                </div>
              )}

              {step === 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {loanPurposeOptions.map((option) => (
                    <ChoiceCard
                      key={option.value}
                      selected={form.loanPurpose === option.value}
                      title={option.title}
                      text={option.text}
                      onClick={() => update('loanPurpose', option.value)}
                    />
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    {propertyStatusOptions.map((option) => (
                      <ChoiceCard
                        key={option.value}
                        selected={form.propertyStatus === option.value}
                        title={option.title}
                        text={option.text}
                        onClick={() => update('propertyStatus', option.value)}
                      />
                    ))}
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <Field label="State">
                      <select value={form.state} onChange={(event) => update('state', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-800">
                        {stateOptions.map((state) => <option key={state}>{state}</option>)}
                      </select>
                    </Field>
                    <Field label="Suburb or area">
                      <input value={form.suburb} onChange={(event) => update('suburb', event.target.value)} placeholder="e.g. Melbourne" className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold" />
                    </Field>
                    <Field label="When do you need the loan?">
                      <select value={form.timeline} onChange={(event) => update('timeline', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-800">
                        <option value="">Select timeline</option>
                        {timelineOptions.map((time) => <option key={time}>{time}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-3">
                    <Field label="Property value">
                      <input type="number" value={form.propertyValue} onChange={(event) => update('propertyValue', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold" />
                    </Field>
                    <Field label="Deposit available">
                      <input type="number" value={form.deposit} onChange={(event) => update('deposit', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold" />
                    </Field>
                    <Field label="Loan amount needed">
                      <input type="number" value={form.loanAmount} onChange={(event) => update('loanAmount', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold" />
                    </Field>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-black text-slate-700">Are you a first home buyer?</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {['yes', 'no'].map((value) => (
                        <ChoiceCard
                          key={value}
                          selected={form.firstHomeBuyer === value}
                          title={value === 'yes' ? 'Yes, first home buyer' : 'No, not my first property'}
                          onClick={() => update('firstHomeBuyer', value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-[2rem] bg-slate-950 p-5 text-white md:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-400">Deposit</p>
                      <p className="mt-1 text-2xl font-black">{depositPercent}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Estimated LVR</p>
                      <p className="mt-1 text-2xl font-black">{lvr}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Sample repayment</p>
                      <p className="mt-1 text-2xl font-black">{currency(monthlyRepayment)}/mo</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Employment status">
                      <select value={form.employment} onChange={(event) => update('employment', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-800">
                        <option value="">Select employment</option>
                        {employmentOptions.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </Field>
                    <Field label="Credit score range">
                      <select value={form.creditScore} onChange={(event) => update('creditScore', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-800">
                        <option value="">Select credit range</option>
                        {creditOptions.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </Field>
                    <Field label="Your annual income">
                      <input type="number" value={form.income} onChange={(event) => update('income', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold" />
                    </Field>
                    <Field label="Second income / partner income">
                      <input type="number" value={form.secondIncome} onChange={(event) => update('secondIncome', event.target.value)} placeholder="Optional" className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold" />
                    </Field>
                    <Field label="Dependents">
                      <input type="number" min="0" value={form.dependents} onChange={(event) => update('dependents', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold" />
                    </Field>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {preferenceOptions.map((option) => (
                    <ChoiceCard
                      key={option.value}
                      type="checkbox"
                      selected={form.preferences.includes(option.value)}
                      title={option.title}
                      onClick={() => togglePreference(option.value)}
                    />
                  ))}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="First name">
                      <input value={form.firstName} onChange={(event) => update('firstName', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold" />
                    </Field>
                    <Field label="Last name">
                      <input value={form.lastName} onChange={(event) => update('lastName', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold" />
                    </Field>
                    <Field label="Email address">
                      <input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold" />
                    </Field>
                    <Field label="Phone number">
                      <input type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold" />
                    </Field>
                    <Field label="Best time to contact">
                      <select value={form.bestTime} onChange={(event) => update('bestTime', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-800">
                        {['Anytime', 'Morning', 'Afternoon', 'Evening'].map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </Field>
                  </div>
                  <label className="flex cursor-pointer items-start gap-4 rounded-[1.8rem] border border-amber-200 bg-amber-50 p-5">
                    <input type="checkbox" checked={form.consent} onChange={(event) => update('consent', event.target.checked)} className="mt-1 h-5 w-5 rounded border-slate-300" />
                    <span className="text-sm leading-6 text-slate-700">
                      <strong>I consent to be contacted</strong> by LoanHub and relevant partners about my loan enquiry. I understand this is a comparison request and not a final loan approval.
                    </span>
                  </label>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                  className="rounded-full border border-slate-200 px-7 py-4 font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                >
                  Back
                </button>
                {step < steps.length - 1 ? (
                  <button type="button" onClick={goNext} className="rounded-full bg-blue-600 px-8 py-4 font-black text-white shadow-lg shadow-blue-200 hover:-translate-y-1 hover:bg-blue-700">
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-slate-950 px-8 py-4 font-black text-white shadow-lg shadow-slate-200 hover:-translate-y-1 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit & Compare'}
                  </button>
                )}
              </div>
            </div>

          </form>
        )}
      </section>
    </div>
  );
}
