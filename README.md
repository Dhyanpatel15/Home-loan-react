# LoanHub Final Working Project

This is a complete Next.js + Tailwind project with all requested updates.

## Included changes

- Home page `Get Started Now` redirects to `/compare`.
- Home Loans page has been removed from navigation/footer.
- Compare page includes:
  - multi-step loan enquiry flow
  - live tracking panel
  - no right-side summary/match snapshot
  - backend API submit
- Lead functionality includes:
  - stores leads in `data/leads.json`
  - email notification ready for Phase 1 using Resend
  - future API/webhook support
- Calculator page includes:
  - Borrowing power
  - Repayment
  - Refinance
  - First home buyer
  - Investment
  - Construction
  - Property value
  - Offset
  - Equity
  - LMI
  - Stamp duty
- No `lucide-react` dependency is used.
- `.npmrc` included to reduce npm lock/cache issues on Windows.

## How to run

1. Extract the zip.
2. Open terminal inside the extracted folder.
3. Run:

```bash
npm install --legacy-peer-deps --no-audit --no-fund --package-lock=false
npm run dev
```

Then open:

```text
http://localhost:3000
```

Compare form:

```text
http://localhost:3000/compare
```

Lead API:

```text
http://localhost:3000/api/leads
```

## Windows easy start

Double-click or run:

```text
start-here-windows.bat
```

If npm crashes, run:

```text
fix-npm-windows.bat
```

If the same npm error still appears, install Node.js 20 LTS, restart the computer, then run the script again.

## Email setup

Copy `.env.local.example` to `.env.local`.

Database save works without email settings. To enable email, add:

```env
LEAD_EMAIL_TO=your-email@example.com
RESEND_API_KEY=your_resend_api_key
```

## Future API setup

To send leads to another API/webhook later, add:

```env
LEAD_WEBHOOK_URL=https://your-api-url.com/leads
LEAD_WEBHOOK_TOKEN=your_token_if_needed
```
