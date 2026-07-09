import Link from 'next/link';

const services = [
  {
    title: 'Home Loans',
    text: 'Compare flexible home loan options tailored to your goals and financial profile.',
  },
  {
    title: 'Refinance Loans',
    text: 'Explore smarter refinance options to reduce repayments and improve loan structure.',
  },
  {
    title: 'Investment Loans',
    text: 'Find suitable lending options for property investment and long-term growth.',
  },
  {
    title: 'First Home Buyer Loans',
    text: 'Simple guidance and loan comparison support for first home buyers.',
  },
  {
    title: 'Construction Loans',
    text: 'Get support for building, renovation, and construction finance requirements.',
  },
  {
    title: 'Small Business Loans',
    text: 'Support your business goals with flexible loan enquiry and comparison tools.',
  },
];

const stats = [
  ['11+', 'Smart calculators'],
  ['6', 'Lead form steps'],
  ['24/7', 'Online enquiry'],
];

const benefits = [
  'Personalized loan enquiry',
  'Competitive comparison flow',
  'Lead tracking system',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#071421] px-4 py-20 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,#60a5fa,transparent_35%),radial-gradient(circle_at_bottom_right,#22d3ee,transparent_30%)]" />

        <div className="container-shell relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-100">
              Loan Comparison Platform
            </p>

            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
              Find better home loan options with a guided comparison journey.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A simple, modern loan enquiry platform with multi-step lead form,
              smart calculators, live tracking, database leads, and email-ready
              backend support.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/compare"
                className="rounded-full bg-white px-8 py-4 text-center font-black text-slate-950 shadow-xl transition hover:bg-cyan-100"
              >
                Get Started Now
              </Link>

              <Link
                href="/calculators"
                className="rounded-full border border-white/15 bg-white/10 px-8 py-4 text-center font-black text-white transition hover:bg-white/20"
              >
                Explore Calculators
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="rounded-[1.5rem] bg-white p-6 text-slate-950 shadow-2xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">
                Live loan snapshot
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Start with 6 simple steps
              </h2>

              <div className="mt-6 space-y-3">
                {[
                  'Choose your loan goal',
                  'Add property details',
                  'Enter loan amount',
                  'Share income profile',
                  'Select preferences',
                  'Submit enquiry',
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#071421] text-sm font-black text-white">
                      {index + 1}
                    </span>
                    <span className="font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="container-shell py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mx-auto inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-blue-600">
            Our Services
          </p>

          <h2 className="mt-5 text-4xl font-black leading-tight text-slate-950">
            Comprehensive financial solutions tailored to your needs
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-2">
          {services.map((item) => (
            <div
              key={item.title}
              className="group flex items-center justify-between gap-5 border-b border-slate-200 p-7 transition hover:bg-slate-50 md:odd:border-r"
            >
              <div className="flex gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-xl">
                  $
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              </div>

              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-lg font-black transition group-hover:bg-[#071421] group-hover:text-white">
                →
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/compare"
            className="inline-flex rounded-full bg-[#071421] px-7 py-3 text-sm font-black text-white transition hover:bg-blue-700"
          >
            View More →
          </Link>
        </div>
      </section>

      {/* CONTACT + VIDEO + CALCULATOR STYLE CARDS */}
      <section className="container-shell pb-20">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          <div className="flex min-h-[250px] flex-col justify-between rounded-2xl bg-slate-100 p-8">
            <h3 className="text-2xl font-black leading-tight">
              Get in touch with our team for personalized support and expert
              guidance.
            </h3>

            <Link
              href="/contact"
              className="mt-8 inline-flex w-fit rounded-full border border-slate-950 px-5 py-3 text-sm font-black transition hover:bg-slate-950 hover:text-white"
            >
              Contact To Team →
            </Link>
          </div>

          <div className="relative min-h-[250px] overflow-hidden rounded-2xl bg-[#071421] p-8 text-white">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,#93c5fd,transparent_45%)]" />
            <div className="relative flex h-full flex-col justify-end">
              <button className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-white text-slate-950">
                ▶
              </button>
              <p className="text-sm font-black">Click to watch</p>
              <p className="text-xs text-slate-300">See how LoanHub works</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-100 p-8">
            <h3 className="text-xl font-black">How Much Do You Need?</h3>

            <div className="mt-8 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>$5,000</span>
                  <span>$500,000</span>
                </div>
                <input type="range" className="mt-2 w-full" />
                <p className="mt-1 text-center text-sm font-black">$250,000</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>1 Month</span>
                  <span>12 Months</span>
                </div>
                <input type="range" className="mt-2 w-full" />
                <p className="mt-1 text-center text-sm font-black">6 Months</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Pay Monthly</p>
                  <p className="font-black">$15,500.00</p>
                </div>
                <div>
                  <p className="text-slate-500">Total Payback</p>
                  <p className="font-black">$90,000.00</p>
                </div>
              </div>

              <Link
                href="/compare"
                className="inline-flex w-full justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-[#071421] hover:text-white"
              >
                Apply For Loan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DARK TRUST SECTION */}
      <section className="bg-[#071421] px-4 py-20 text-white">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-[1fr_0.55fr]">
          <div>
            <p className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-100">
              Why Choose Us
            </p>

            <h2 className="mt-5 max-w-2xl text-4xl font-black leading-tight">
              Your trusted partner for personalized loan solutions and expert
              financial guidance.
            </h2>

            <div className="mt-8 h-60 rounded-2xl bg-white/10 p-6">
              <div className="flex h-full items-end rounded-xl bg-gradient-to-br from-white/20 to-white/5 p-6">
                <p className="max-w-md text-lg font-bold text-slate-200">
                  We make the loan enquiry journey simple, transparent, and easy
                  to track from start to finish.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {benefits.map((item) => (
                <div key={item}>
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/10">
                    ✓
                  </div>
                  <h3 className="mt-4 font-black">{item}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Clean process, smart comparison, and smooth lead management.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {stats.map(([value, label]) => (
              <div key={label}>
                <p className="text-5xl font-black text-white/80">{value}</p>
                <div className="mt-3 h-px bg-white/20" />
                <p className="mt-3 text-sm font-bold text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}