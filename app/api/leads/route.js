import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const IS_VERCEL = Boolean(process.env.VERCEL);
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const TMP_DATA_DIR = '/tmp/loanhub';
const FALLBACK_DATA_DIR = process.env.LEAD_DB_DIR || (IS_VERCEL ? TMP_DATA_DIR : LOCAL_DATA_DIR);
const FALLBACK_DB_FILE = path.join(FALLBACK_DATA_DIR, 'leads.json');

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_TABLE = process.env.SUPABASE_LEADS_TABLE || 'loan_leads';
const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

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

function safeLeadBody(body) {
  return {
    ...body,
    firstName: cleanText(body.firstName),
    lastName: cleanText(body.lastName),
    email: cleanText(body.email),
    phone: cleanText(body.phone),
    loanPurpose: cleanText(body.loanPurpose),
    propertyStatus: cleanText(body.propertyStatus),
    state: cleanText(body.state),
    suburb: cleanText(body.suburb),
    timeline: cleanText(body.timeline),
    employment: cleanText(body.employment),
    creditScore: cleanText(body.creditScore),
    bestTime: cleanText(body.bestTime),
    preferences: Array.isArray(body.preferences) ? body.preferences : [],
  };
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

async function readFallbackLeads() {
  try {
    const raw = await readFile(FALLBACK_DB_FILE, 'utf8');
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    console.error('Fallback lead read error:', error);
    return [];
  }
}

async function saveLeadToFallbackFile(lead) {
  await mkdir(FALLBACK_DATA_DIR, { recursive: true });
  const leads = await readFallbackLeads();
  leads.unshift(lead);
  await writeFile(FALLBACK_DB_FILE, JSON.stringify(leads, null, 2), 'utf8');

  return {
    status: IS_VERCEL ? 'saved-temporary' : 'saved',
    storage: IS_VERCEL ? 'vercel-tmp' : 'local-json',
    totalLeads: leads.length,
    message: IS_VERCEL
      ? 'Lead saved to Vercel /tmp temporary storage. Add Supabase ENV for permanent database storage.'
      : 'Lead saved to local data/leads.json.',
  };
}

async function saveLeadToSupabase(lead) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      id: lead.id,
      submitted_at: lead.submittedAt,
      lead,
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.message || result?.hint || `Supabase returned ${response.status}`;
    throw new Error(message);
  }

  return {
    status: 'saved',
    storage: 'supabase',
    providerResult: result,
  };
}

async function saveLeadToDatabase(lead) {
  if (HAS_SUPABASE) {
    try {
      return await saveLeadToSupabase(lead);
    } catch (error) {
      console.error('Supabase save failed, using fallback storage:', error);
      const fallback = await saveLeadToFallbackFile(lead);
      return {
        ...fallback,
        status: 'saved-fallback',
        supabaseError: error.message,
      };
    }
  }

  return saveLeadToFallbackFile(lead);
}

async function readSupabaseLeads() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?select=id,submitted_at,lead&order=submitted_at.desc`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      cache: 'no-store',
    }
  );

  const rows = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(rows?.message || `Supabase returned ${response.status}`);
  }

  return Array.isArray(rows) ? rows.map((row) => row.lead || row) : [];
}

async function readLeadsFromDatabase() {
  if (HAS_SUPABASE) {
    try {
      const leads = await readSupabaseLeads();
      return { storage: 'supabase', leads };
    } catch (error) {
      console.error('Supabase read failed, using fallback storage:', error);
      const leads = await readFallbackLeads();
      return { storage: 'fallback', leads, supabaseError: error.message };
    }
  }

  const leads = await readFallbackLeads();
  return { storage: IS_VERCEL ? 'vercel-tmp' : 'local-json', leads };
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

  try {
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
  } catch (error) {
    return {
      status: 'failed',
      message: error.message || 'Email request failed.',
    };
  }
}

async function sendLeadToFutureApi(lead) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      status: 'skipped',
      message: 'Future API webhook is not configured yet.',
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.LEAD_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
          : {}),
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
  } catch (error) {
    return {
      status: 'failed',
      message: error.message || 'Future API request failed.',
    };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validationError = validateLead(body);

    if (validationError) {
      return Response.json({ success: false, message: validationError }, { status: 400 });
    }

    const safeBody = safeLeadBody(body);
    const lead = {
      ...safeBody,
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

    const database = await saveLeadToDatabase(lead);
    const email = await sendLeadEmail(lead);
    const futureApi = await sendLeadToFutureApi(lead);

    return Response.json({
      success: true,
      message: 'Lead submitted successfully.',
      leadId: lead.id,
      totalLeads: database.totalLeads || null,
      database,
      email,
      futureApi,
    });
  } catch (error) {
    console.error('Lead submission fatal error:', error);
    return Response.json(
      {
        success: false,
        message: error.message || 'Unable to submit lead. Please try again.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await readLeadsFromDatabase();
    return Response.json({
      success: true,
      storage: result.storage,
      total: result.leads.length,
      leads: result.leads,
      supabaseError: result.supabaseError || null,
    });
  } catch (error) {
    console.error('Lead read fatal error:', error);
    return Response.json({ success: true, storage: 'error', total: 0, leads: [], message: error.message });
  }
}
