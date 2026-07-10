'use client';

import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '-';
  }
}

function money(value) {
  const number = Number(String(value || '').replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(number) || number === 0) return '-';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(number);
}

export default function LeadsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [storage, setStorage] = useState('');
  const [leads, setLeads] = useState([]);

  async function loadLeads() {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/leads', { cache: 'no-store' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to load leads.');
      }

      setStorage(result.storage || 'database');
      setLeads(Array.isArray(result.leads) ? result.leads : []);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load leads.');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  return (
    <main className="min-h-screen bg-brand-paper">
      <section className="relative overflow-hidden bg-brand-navy px-4 py-14 text-white">
        <div className="absolute inset-0 hero-dots opacity-20" />
        <div className="container-shell relative">
          <p className="loan-pill inline-flex bg-white/10 px-4 py-2 text-brand-mint">Lead database</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">Submitted loan enquiries</h1>
          <p className="mt-3 text-lg text-slate-300">
            Total leads saved: <strong className="text-white">{leads.length}</strong>
          </p>
          <p className="mt-2 text-sm text-slate-400">Storage: {storage || 'loading...'}</p>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="mb-5 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-lift sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-brand-navy">Lead records</h2>
            <p className="mt-1 text-sm text-slate-600">Refresh after submitting a new comparison request.</p>
          </div>
          <button
            type="button"
            onClick={loadLeads}
            className="rounded-full bg-brand-navy px-6 py-3 font-black text-white transition hover:bg-brand-blue"
          >
            Refresh Leads
          </button>
        </div>

        {loading ? (
          <div className="loan-card p-10 text-center">
            <h2 className="text-2xl font-black text-brand-navy">Loading leads...</h2>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
            <h2 className="text-2xl font-black">{error}</h2>
          </div>
        ) : leads.length === 0 ? (
          <div className="loan-card p-10 text-center">
            <h2 className="text-3xl font-black text-brand-navy">No leads found</h2>
            <p className="mt-3 text-slate-600">Submit the compare form first, then refresh this page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[2rem] bg-white shadow-lift">
            <table className="w-full min-w-[1200px] text-left">
              <thead className="bg-brand-navy text-white">
                <tr>
                  <th className="p-4">Lead ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Goal</th>
                  <th className="p-4">Property Value</th>
                  <th className="p-4">Loan Amount</th>
                  <th className="p-4">Income</th>
                  <th className="p-4">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr key={lead.id || index} className="border-b border-slate-100 hover:bg-blue-50/40">
                    <td className="p-4 font-black text-brand-blue">{lead.id || '-'}</td>
                    <td className="p-4 font-black text-brand-navy">{lead.firstName || '-'} {lead.lastName || ''}</td>
                    <td className="p-4 text-slate-700">{lead.email || '-'}</td>
                    <td className="p-4 text-slate-700">{lead.phone || '-'}</td>
                    <td className="p-4 text-slate-700">{lead.loanPurpose || '-'}</td>
                    <td className="p-4 text-slate-700">{money(lead.propertyValue)}</td>
                    <td className="p-4 text-slate-700">{money(lead.loanAmount)}</td>
                    <td className="p-4 text-slate-700">{money(lead.income)}</td>
                    <td className="p-4 text-slate-500">{formatDate(lead.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
