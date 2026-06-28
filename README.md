# Find-Template

FindTemplates is a full-stack web application for template browsing, project management, team assignment, role-based dashboards, and admin workspace management.

## Project Structure

- `src/` — Next.js frontend dashboard and landing pages
- `src/pages/api/[...path].js` — Vercel API bridge that runs the Express backend under `/api/*`
- `backend/` — Express/MongoDB backend API source
- `public/` — static assets served by Next.js

## Vercel Deployment

Deploy from the repository root (`./`) as a Next.js project. Do not choose `src/`, `public/`, or `backend/` as the Vercel root directory.

Recommended Vercel project settings:

- Root Directory: `./`
- Framework Preset: Next.js
- Install Command: default / `npm install`
- Build Command: `npm run build`
- Output Directory: default / `.next`
- Node.js Version: 20.x or newer

Required environment variables:

```text
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=12h
FRONTEND_URLS=https://your-project.vercel.app,https://your-custom-domain.com
COOKIE_SAME_SITE=lax
```

For this single Vercel deployment, keep API calls same-origin. Either leave `NEXT_PUBLIC_API_URL` unset or set it to:

```text
NEXT_PUBLIC_API_URL=/api
```

Make sure MongoDB Atlas Network Access allows Vercel to connect. For quick testing you can allow `0.0.0.0/0`; use stricter networking later if your hosting setup supports it.

After deployment, test these URLs:

- `https://your-domain.com/api/health` — verifies the Vercel API bridge is running without requiring MongoDB
- `https://your-domain.com/api/health/db` — verifies MongoDB connectivity

If login/signup returns 500, check Vercel Function Logs for messages such as missing environment variables, MongoDB connection failures, or CORS rejected origins.

## Notes

Environment files, dependencies, logs, and build outputs are excluded through `.gitignore`.
