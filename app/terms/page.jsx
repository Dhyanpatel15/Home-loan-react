export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-14">
      <div className="container-shell max-w-4xl rounded-[2.5rem] bg-white p-8 shadow-soft">
        <h1 className="text-4xl font-black text-slate-950">Terms & Conditions</h1>
        <div className="mt-8 space-y-6 leading-7 text-slate-600">
          <p>LoanHub provides general comparison information and enquiry support only.</p>
          <p>Calculator results are estimates and should not be treated as financial advice or loan approval.</p>
          <p>Submitted enquiries may be stored, emailed to the configured recipient, and sent to a future API/webhook when configured.</p>
          <p>Final loan offers, rates, fees, and approvals depend on lender assessment.</p>
        </div>
      </div>
    </div>
  );
}
