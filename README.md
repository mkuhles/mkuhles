# mkuhles

Personal website for Melanie Kuhles: CV, portfolio, and blog in one place.

## What this site is
- A **portfolio** and **CV** with selected projects and experience.
- A **blog** for web development topics.
- A living site that evolves over time.

## Goals
- Clear structure and maintainable code.
- Pragmatic, modern web development.
- Real-world solutions over marketing polish.

## Tech stack
- Astro + MDX
- TypeScript
- CSS
- PostCSS

## Development
```bash
npm install
npm run dev
```

## Build & preview
```bash
npm run build
npm run preview
```

## SFTP deploy
```bash
npm run build
cp scripts/.deploy-sftp.env.example scripts/.deploy-sftp.env
./scripts/deploy-sftp.sh
```

Optional override examples:
```bash
./scripts/deploy-sftp.sh --dry-run
./scripts/deploy-sftp.sh --host example.com --user username --remote-dir /path/to/webroot/melanie
```

The script reads host/user/target config from `scripts/.deploy-sftp.env`,
always prompts for the SFTP password interactively, uploads `dist/`,
and mirrors with delete.

## Content & i18n
- Blog posts: `src/content/blog`
- Section content: `src/content/sections`
- Localized routes: `src/i18n/routes.json`
- Translations and SEO strings: `src/i18n/strings.json`
