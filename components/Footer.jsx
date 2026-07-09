import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 px-4 py-12 text-white">
      <div className="container-shell">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-black">LoanHub</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              A modern home loan comparison and lead platform for calculators, enquiries, and lender matching.
            </p>
          </div>

          <div>
            <h4 className="font-black">Quick Links</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><Link href="/compare" className="hover:text-white">Compare Loans</Link></li>
              <li><Link href="/calculators" className="hover:text-white">Calculators</Link></li>
              <li><Link href="/real-estate" className="hover:text-white">Buy & Sell</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black">Help</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black">Contact</h4>
            <p className="mt-4 text-sm text-slate-400">Call: 1300 123 456</p>
            <p className="mt-2 text-sm text-slate-400">Email: hello@loanhub.com.au</p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          © 2026 LoanHub. All rights reserved. This website provides general comparison information only.
        </div>
      </div>
    </footer>
  );
}
