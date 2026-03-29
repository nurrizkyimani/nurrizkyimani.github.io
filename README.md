# Personal Portfolio Website

A personal portfolio site built with Next.js, TypeScript, and Tailwind CSS.

The page content is statically generated from markdown files in `pages/markdown`, so updating profile data is straightforward without changing React components.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Content Management](#content-management)
- [Blog Authoring](#blog-authoring)
- [Build and Deployment](#build-and-deployment)
- [Live URLs](#live-urls)
- [Troubleshooting](#troubleshooting)

## Tech Stack

- Next.js 13 (Pages Router)
- React 18
- TypeScript
- Tailwind CSS
- `gray-matter` for markdown frontmatter parsing

## Prerequisites

- Node.js `>=14.6.0` (recommended: Node.js 18 LTS)
- npm (comes with Node.js)

Check installed versions:

```bash
node -v
npm -v
```

## Getting Started

1. Clone the repository:

```bash
git clone <your-repo-url>
cd personal-nurrizky
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## Environment Variables

This project supports optional runtime flags:

```env
NEXT_PUBLIC_HIDE_PROJECT_SECTION=false
NEXT_PUBLIC_USE_V2_FONT=false
```

Setup:

1. Copy `.env.example` to `.env.local`
2. Set `NEXT_PUBLIC_HIDE_PROJECT_SECTION=true` to hide Projects (`false` or unset to show)
3. Set `NEXT_PUBLIC_USE_V2_FONT=true` to enable Andre-style typography (Kaisei Opti for headings/brand + system sans for body)
4. Restart the dev server after changes

For Vercel:

1. Open Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_HIDE_PROJECT_SECTION` with value `true` for Production
3. Add `NEXT_PUBLIC_USE_V2_FONT` with value `true` when you want the new font theme
4. Redeploy

## Available Scripts

- `npm run dev`: Starts local development server
- `npm run build`: Creates production build
- `npm run start`: Runs production server after build
- `npm run export`: Exports static site to `out/`
- `npm run predeploy`: Runs build before deployment
- `npm run deploy`: Builds, exports, and deploys static files to GitHub Pages using `gh-pages`

## Project Structure

```text
.
├── components/            # Reusable UI components (navigation, close button, blog nav)
├── hooks/                 # Link/menu data hooks
├── lib/                   # Shared data utilities (including blog markdown parser)
├── pages/
│   ├── index.tsx          # Main portfolio page
│   ├── blog/              # Blog pages (/blog, /blog/[post], /blog/tags)
│   ├── api/hello.ts       # Example API route
│   └── markdown/          # Content source files (frontmatter-driven)
│       └── blog/          # One markdown file per blog post
├── public/                # Static assets (images, favicon)
├── styles/                # Global styles
├── next.config.js         # Next.js config (strict mode, trailing slash)
├── tailwind.config.js     # Tailwind config
└── package.json           # Scripts and dependencies
```

## Content Management

Most portfolio content is loaded from markdown files using frontmatter:

- `pages/markdown/hero.md`
- `pages/markdown/about.md`
- `pages/markdown/work.md`
- `pages/markdown/project.md`
- `pages/markdown/stack.md`

Data is parsed in `getStaticProps` inside `pages/index.tsx` and rendered at build time.

When editing content:

- Keep frontmatter keys consistent with existing schema
- Keep list field types intact (for example `highlights`, `tags_project`, `perlevel_stack`)
- Ensure image file names referenced in markdown exist in `public/`

## Blog Authoring

Blog posts are stored as one file per post in `pages/markdown/blog/`.

Filename standard in this repository:

- `y<yy>m<m>w<w>d<d>-<title-kebab>.md`
- Example: `y26m3w2d4-dokumentasi-musik-rekindled.md`

Frontmatter contract:

```md
---
title: Reflection on 2025
date: 2025-12-31
tags:
  - reflection
  - culture
excerpt: Short summary shown on /blog list.
cover_image: /blog/reflection-2025.jpg
cover_image_alt: Foggy house in the hills
---

Full markdown content here...
```

Rules:

- `title`, `date`, `tags`, and `excerpt` are required
- `date` must use `YYYY-MM-DD`
- Tags are case-insensitive for routes and normalized to kebab-case URLs
- Post order on `/blog` is newest-first by `date` (not by filename)
- Optional `cover_image` can be local (`/blog/<file>`) or external URL

Image guidance:

- Put local blog images in `public/blog/`
- Reference them in markdown frontmatter as `/blog/<filename>`
- Example: `cover_image: /blog/reflection-2025.jpg`

## Build and Deployment

### Production build (local check)

```bash
npm run build
npm run start
```

### Static export

```bash
npm run export
```

Generated output is in `out/`.

### GitHub Pages deployment

```bash
npm run deploy
```

Notes:

- This uses the `gh-pages` package to publish `out/`
- `homepage` in `package.json` should match your GitHub Pages URL
- `trailingSlash: true` in `next.config.js` is already set for static hosting compatibility

## Live URLs

Primary production URL:

- https://nurrizkyimani.netlify.app

Mirror deployments:

- https://nurrizkyimani.vercel.com
- https://nurrizkyimani.github.io

## Troubleshooting

- `node: command not found`
  - Install Node.js first, then rerun `npm install`

- Build succeeds but images do not show
  - Verify file names in markdown match files under `public/`

- Changes in markdown are not reflected
  - Restart the dev server to clear stale state

- Deployment path issues on GitHub Pages
  - Re-check `homepage` in `package.json` and repository Pages settings
