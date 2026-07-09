import Link from 'next/link';

const benefits = [
  { title: 'Fast compare flow', text: 'Simple step-by-step loan enquiry with live tracking.' },
  { title: 'Smart calculators', text: 'Borrowing, repayment, refinance, LMI, stamp duty and more.' },
  { title: 'Database leads', text: 'Every enquiry is saved through the backend lead API.' },
  { title: 'Email ready', text: 'Phase 1 email notifications are ready through environment settings.' },
];

const stats = [
  ['11+', 'Calculators'],
  ['6', 'Lead steps'],
  ['24/7', 'Online enquiry'],
  ['100%', 'No obligation'],
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white sm:py-28">
        <div className="absolute inset-0 bg-hero-grid bg-[length:28px_28px] opacity-30" />
        <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="container-shell relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
              Compare smarter. Apply faster.
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
              Find better home loan options with a guided comparison journey.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Use a clean multi-step flow, live application tracking, calculators, and a backend lead system built for database, email, and future API integrations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/compare" className="rounded-full bg-white px-8 py-4 text-center font-black text-slate-950 shadow-xl hover:bg-cyan-100">
                Get Started Now
              </Link>
              <Link href="/calculators" className="rounded-full border border-white/15 bg-white/10 px-8 py-4 text-center font-black text-white hover:bg-white/20">
                Explore Calculators
              </Link>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/10 p-6 shadow-soft backdrop-blur">
            <div className="rounded-[2rem] bg-white p-6 text-slate-950">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-600">Live loan snapshot</p>
              <h2 className="mt-3 text-3xl font-black">Start with 6 simple steps</h2>
              <div className="mt-6 space-y-3">
                {['Choose your goal', 'Add property details', 'Enter loan amount', 'Share income profile', 'Select preferences', 'Submit enquiry'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-sm font-black text-white">{index + 1}</span>
                    <span className="font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-[2rem] bg-white p-6 text-center shadow-soft">
              <p className="text-3xl font-black text-blue-600">{value}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell pb-16">
        <div className="mb-8 text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">Why LoanHub</p>
          <h2 className="mt-3 text-4xl font-black text-slate-950">Built for users and lead management</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {benefits.map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-soft">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-xl">✓</span>
              <h3 className="mt-5 text-xl font-black text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
