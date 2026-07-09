export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-14">
      <div className="container-shell max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">Contact</p>
          <h1 className="mt-3 text-5xl font-black text-slate-950">Get in touch</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Send a message or submit the compare form to create a tracked lead.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ['Phone', '1300 123 456'],
            ['Email', 'hello@loanhub.com.au'],
            ['Location', 'Melbourne, Australia'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[2rem] bg-white p-6 text-center shadow-soft">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">{label}</p>
              <p className="mt-3 font-black text-slate-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[2.5rem] bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-black text-slate-950">Send us a message</h2>
          <form className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-slate-200 px-4 py-4 font-semibold" placeholder="Your name" />
              <input className="rounded-2xl border border-slate-200 px-4 py-4 font-semibold" placeholder="Your email" />
            </div>
            <input className="rounded-2xl border border-slate-200 px-4 py-4 font-semibold" placeholder="Subject" />
            <textarea className="min-h-36 rounded-2xl border border-slate-200 px-4 py-4 font-semibold" placeholder="Your message" />
            <button type="button" className="rounded-full bg-blue-600 px-8 py-4 font-black text-white hover:bg-blue-700">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
