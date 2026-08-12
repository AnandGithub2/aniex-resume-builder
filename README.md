# FolioATS

A client-side ATS-friendly resume builder built with React, TypeScript, Vite, Tailwind CSS and jsPDF.

## Features
- 15 single-column resume templates
- Live A4 preview
- ATS structure/content checks
- Selectable-text PDF export
- Local browser storage only
- JSON export and duplicate drafts

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Deploy to Vercel
Import this repository into Vercel. The project uses Vite, and `vercel.json` rewrites application routes to `index.html` for React Router.

No backend or environment variables are required.
