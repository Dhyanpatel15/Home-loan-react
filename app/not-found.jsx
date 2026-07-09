import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-24 text-white">
      <div className="container-shell text-center">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">404</p>
        <h1 className="mt-4 text-5xl font-black">Page not found</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-300">
          The page you are looking for is not available. Start a fresh home loan comparison instead.
        </p>
        <Link href="/compare" className="mt-8 inline-flex rounded-full bg-white px-8 py-4 font-black text-slate-950 hover:bg-cyan-100">
          Start Compare
        </Link>
      </div>
    </div>
  );
}
