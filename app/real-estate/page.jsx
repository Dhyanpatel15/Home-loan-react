import Link from 'next/link';

const propertyCards = [
  { title: 'Buy a property', text: 'Explore your borrowing range before speaking with agents.', action: 'Start Compare', href: '/compare' },
  { title: 'Sell a property', text: 'Connect your next move with finance planning and property support.', action: 'Contact Us', href: '/contact' },
];

const suburbs = ['Melbourne CBD', 'Southbank', 'Fitzroy', 'Carlton', 'Richmond', 'St Kilda'];

export default function RealEstatePage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-14">
      <div className="container-shell">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">Property support</p>
          <h1 className="mt-3 text-5xl font-black text-slate-950">Buy & Sell Property</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Plan your property move with a simple finance-first journey.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {propertyCards.map((card) => (
            <div key={card.title} className="rounded-[2.5rem] bg-white p-8 shadow-soft">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-2xl">🏡</div>
              <h2 className="mt-6 text-3xl font-black text-slate-950">{card.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{card.text}</p>
              <Link href={card.href} className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 font-black text-white hover:bg-blue-700">
                {card.action}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[2.5rem] bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-black text-slate-950">Popular areas</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suburbs.map((suburb) => (
              <div key={suburb} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-black text-slate-900">{suburb}</p>
                <p className="mt-1 text-sm text-slate-500">Property and lending guidance available.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
