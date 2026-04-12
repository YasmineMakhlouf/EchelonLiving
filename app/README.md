# Frontend Deployment Guide

This frontend is a Vite + React app and is ready to be built and hosted as static assets.

## Scripts

- `npm run dev`: local development
- `npm run build`: production build to `dist/`
- `npm run serve:static`: serve the built app locally on port 4173

## Environment Variables

Create `.env` (or platform env vars) based on `.env.example`:

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
```

`VITE_API_BASE_URL` is used by Axios in `src/api/axios.ts`.

## Build for Production

```bash
npm install
npm run build
```

Output will be in `dist/`.

## Hosting Options

### Option 1: Host built static files yourself

```bash
npm run build
npm run serve:static
```

For real production, host `dist/` behind Nginx, Apache, or a CDN.

### Option 2: Netlify

Build command:

```bash
npm run build
```

Publish directory:

```bash
dist
```

Set environment variable in Netlify UI:

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
```

### Option 3: Vercel

Framework preset: `Vite`

Build command:

```bash
npm run build
```

Output directory:

```bash
dist
```

Set environment variable in Vercel UI:

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
```
