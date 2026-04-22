# Deployment

## Option A — Vercel (zero-ops, fastest)

Good for **demo-only** deployments. Note: Vercel's serverless runtime resets
the filesystem between invocations, so the file-backed LRS will lose data on
every cold start. Fine for sales demos; **not fine for pilots**.

```bash
# From the repo root
npx vercel link
npx vercel --prod
```

Set environment variables in the Vercel dashboard:

```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

**Production cutover**: swap `src/lib/lrs-store.ts` for a Postgres-backed
implementation (Neon / Supabase / RDS) before any customer pilot.

## Option B — Docker (demoable + pilot-ready)

```bash
# Build the image
docker build -t mktech/pharmasim:latest .

# Run with a persistent volume for the LRS
docker run -d \
  --name pharmasim \
  -p 3000:3000 \
  -v pharmasim_data:/app/.data \
  mktech/pharmasim:latest

# Or via compose
docker compose up -d
```

The LRS data is durable in the `pharmasim_data` volume across container
restarts. Back it up before major upgrades.

## Option C — Azure App Service (customer-preferred)

Both Aurobindo and MSN typically standardise on Azure. Recommended path for a
pilot:

1. Push image to Azure Container Registry
2. Deploy to **Azure App Service for Containers** (Linux)
3. Mount Azure Files share at `/app/.data` for LRS persistence
4. Add Azure AD B2C / Entra ID for SSO (replace the mock e-signature)
5. Front-end with Azure Front Door + WAF

## Production-readiness checklist

Before putting this in front of a plant QA team:

- [ ] Replace file-backed LRS with Postgres (hash-chained rows for tamper evidence)
- [ ] Implement OIDC auth (Azure AD / Okta) — mock e-sig only fit for demos
- [ ] Add audit log retention policy (≥ 6 years for GxP)
- [ ] Turn on TLS + HSTS at the edge
- [ ] Penetration test the xAPI endpoint (rate limiting, schema abuse)
- [ ] IQ/OQ/PQ documentation per GAMP 5
- [ ] Data residency: host within India for Aurobindo/MSN compliance teams
- [ ] Backup + restore drill for the LRS / Postgres
- [ ] Disaster-recovery RPO/RTO agreed with plant IT

## Environment variables (planned)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection string (prod LRS) |
| `NEXT_PUBLIC_ORG_LABEL` | White-label header (e.g. "Aurobindo") |
| `OIDC_ISSUER` | OIDC issuer URL |
| `OIDC_CLIENT_ID` | OIDC client id |
| `OIDC_CLIENT_SECRET` | OIDC client secret |
| `XAPI_SIGNING_KEY` | HMAC key for tamper-evident statement chaining |
