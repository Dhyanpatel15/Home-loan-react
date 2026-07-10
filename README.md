# Vercel Lead Submit 500 Fix

Your submit error happens because Vercel serverless functions cannot write to your project folder at runtime. This update fixes the API route.

## Replace files

1. Replace:
   app/api/leads/route.js

2. Replace/add:
   app/admin/leads/page.jsx

3. Add/update:
   .env.local.example
   supabase_loan_leads.sql

## Deploy quickly

Deploy after replacing the files. Submit will stop failing with 500.

## Permanent production database

For real persistent database storage on Vercel, connect Supabase:

1. Create a Supabase project.
2. Run `supabase_loan_leads.sql` in Supabase SQL editor.
3. Add these Environment Variables in Vercel:
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   SUPABASE_LEADS_TABLE=loan_leads
4. Redeploy.

Without Supabase, Vercel will use `/tmp` temporary storage, which is only for testing and is not permanent.
