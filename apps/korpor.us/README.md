# Korporus Public Website

Gatsby 5 + Tailwind CSS marketing/docs website for Korporus.

## Quick start

```bash
cd apps/korpor.us
pnpm install
pnpm dev
```

Open `http://localhost:8000`.

## Video previews

Set `GATSBY_VIDEOS_BASE_URL` to point at a local or CDN-backed videos folder.
If unset, the site uses `/videos` and shows placeholders when assets are missing.

## Deployment

This app is wired for AWS Amplify Gen2 via the repo root `amplify.yml`.
The build artifact directory is `apps/korpor.us/public`.
