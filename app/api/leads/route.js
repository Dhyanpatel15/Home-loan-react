import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'leads.json');

function cleanText(value) {
  return String(value || '').trim();
}

function numberValue(value) {
  const parsed = Number(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function currency(value) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(numberValue(value));
}

async function readLeads() {
  try {
    const raw = await readFile(DB_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function saveLeadToDatabase(lead) {
  await mkdir(DATA_DIR, { recursive: true });
  const leads = await readLeads();
  leads.push(lead);
  await writeFile(DB_FILE, JSON.stringify(leads, null, 2), 'utf8');
  return leads.length;
}

function validateLead(body) {
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'loanPurpose'];
  const missingFields = requiredFields.filter((field) => !cleanText(body[field]));

  if (missingFields.length) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }

  if (!body.consent) {
    return 'Consent is required before submitting the lead.';
  }

  if (!/^\S+@\S+\.\S+$/.test(cleanText(body.email))) {
    return 'Please enter a valid email address.';
  }

  return '';
}

function createEmailHtml(lead) {
  const fullName = `${lead.firstName} ${lead.lastName}`.trim();

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <h2 style="margin:0 0 12px">New LoanHub Lead</h2>
      <p><strong>Lead ID:</strong> ${lead.id}</p>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <hr />
      <h3>Loan Details</h3>
      <p><strong>Goal:</strong> ${lead.loanPurpose || '-'}</p>
      <p><strong>Property status:</strong> ${lead.propertyStatus || '-'}</p>
      <p><strong>State:</strong> ${lead.state || '-'}</p>
      <p><strong>Suburb:</strong> ${lead.suburb || '-'}</p>
      <p><strong>Timeline:</strong> ${lead.timeline || '-'}</p>
      <p><strong>Property value:</strong> ${currency(lead.propertyValue)}</p>
      <p><strong>Deposit:</strong> ${currency(lead.deposit)}</p>
      <p><strong>Loan amount:</strong> ${currency(lead.loanAmount)}</p>
      <p><strong>Estimated monthly repayment:</strong> ${currency(lead.summary?.estimatedMonthlyRepayment)}</p>
      <hr />
      <h3>Income & Preferences</h3>
      <p><strong>Employment:</strong> ${lead.employment || '-'}</p>
      <p><strong>Income:</strong> ${currency(lead.income)}</p>
      <p><strong>Second income:</strong> ${currency(lead.secondIncome)}</p>
      <p><strong>Credit score:</strong> ${lead.creditScore || '-'}</p>
      <p><strong>Preferences:</strong> ${(lead.preferences || []).join(', ') || '-'}</p>
      <p><strong>Best time to contact:</strong> ${lead.bestTime || '-'}</p>
    </div>
  `;
}

async function sendLeadEmail(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO;
  const from = process.env.LEAD_EMAIL_FROM || 'LoanHub <onboarding@resend.dev>';

  if (!apiKey || !to) {
    return {
      status: 'skipped',
      message: 'Email is ready, but RESEND_API_KEY and LEAD_EMAIL_TO are not configured.',
    };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: `New LoanHub Lead - ${lead.firstName} ${lead.lastName}`,
      html: createEmailHtml(lead),
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      status: 'failed',
      message: result.message || 'Email provider rejected the request.',
    };
  }

  return {
    status: 'sent',
    providerId: result.id || null,
  };
}

async function sendLeadToFutureApi(lead) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      status: 'skipped',
      message: 'Future API webhook is not configured yet.',
    };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.LEAD_WEBHOOK_TOKEN ? `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` : '',
    },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    return {
      status: 'failed',
      message: `Future API returned ${response.status}`,
    };
  }

  return { status: 'sent' };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validationError = validateLead(body);

    if (validationError) {
      return Response.json({ success: false, message: validationError }, { status: 400 });
    }

    const lead = {
      ...body,
      id: `LH-${Date.now()}`,
      status: 'new',
      source: 'compare-page',
      submittedAt: new Date().toISOString(),
      summary: {
        lvr: body.summary?.lvr || 0,
        depositPercent: body.summary?.depositPercent || 0,
        estimatedMonthlyRepayment: body.summary?.estimatedMonthlyRepayment || 0,
      },
    };

    const totalLeads = await saveLeadToDatabase(lead);
    const email = await sendLeadEmail(lead);
    const futureApi = await sendLeadToFutureApi(lead);

    return Response.json({
      success: true,
      message: 'Lead saved successfully.',
      leadId: lead.id,
      totalLeads,
      email,
      futureApi,
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return Response.json(
      { success: false, message: 'Unable to submit lead. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await readLeads();
    return Response.json({ success: true, total: leads.length, leads });
  } catch (error) {
    console.error('Lead read error:', error);
    return Response.json(
      { success: false, message: 'Unable to read leads.' },
      { status: 500 }
    );
  }
}
