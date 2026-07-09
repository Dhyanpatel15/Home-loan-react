import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

async function getLeads() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'leads.json');
    const file = await fs.readFile(filePath, 'utf8');
    return JSON.parse(file || '[]');
  } catch {
    return [];
  }
}

export default async function LeadsAdminPage() {
  const leads = await getLeads();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-slate-950 p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
            Lead Database
          </p>
          <h1 className="mt-3 text-4xl font-black">Submitted Leads</h1>
          <p className="mt-2 text-slate-300">
            Total leads saved: {leads.length}
          </p>
        </div>

        {leads.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow">
            <h2 className="text-2xl font-black text-slate-900">
              No leads found
            </h2>
            <p className="mt-2 text-slate-600">
              Submit the compare form first, then refresh this page.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-white shadow">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-slate-950 text-white">
                <tr>
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
                  <tr key={lead.id || index} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">
                      {lead.firstName} {lead.lastName}
                    </td>
                    <td className="p-4 text-slate-700">{lead.email}</td>
                    <td className="p-4 text-slate-700">{lead.phone}</td>
                    <td className="p-4 text-slate-700">{lead.loanPurpose}</td>
                    <td className="p-4 text-slate-700">${lead.propertyValue}</td>
                    <td className="p-4 text-slate-700">${lead.loanAmount}</td>
                    <td className="p-4 text-slate-700">${lead.income}</td>
                    <td className="p-4 text-slate-500">
                      {lead.submittedAt
                        ? new Date(lead.submittedAt).toLocaleString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}