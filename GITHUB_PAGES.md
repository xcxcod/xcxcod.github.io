# GitHub Pages Deployment

This project is configured for static export with GitHub Pages.

## Expected URL

For a user or organisation Pages repository named `USERNAME.github.io`, the site URL is:

```text
https://USERNAME.github.io/
```

For a project repository, the URL is:

```text
https://USERNAME.github.io/REPOSITORY-NAME/
```

Set `NEXT_PUBLIC_BASE_PATH` only for a project repository, for example `/REPOSITORY-NAME`. Leave it blank for `USERNAME.github.io`.

## GitHub Repository Settings

1. Go to repository Settings.
2. Open Pages.
3. Set Source to `GitHub Actions`.
4. Open Settings, Secrets and variables, Actions.
5. Add the required public Firebase values as repository variables.

## Required Actions Variables

These are Firebase web config values. They are public client configuration, not Firebase Admin credentials.

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BASE_PATH`

For `https://USERNAME.github.io/`, set `NEXT_PUBLIC_SITE_URL` to that URL and leave `NEXT_PUBLIC_BASE_PATH` blank.

Do not add Firebase Admin private keys for GitHub Pages deployment.

## What Works On GitHub Pages

- Static portfolio pages
- Firebase client-side Authentication
- Public Firestore reads for profile, projects, and skills
- Contact form submissions to Firestore
- Resume access request submissions to Firestore
- Admin sign-in with Firebase Auth
- Admin project/profile/skills management through Firestore rules
- Admin contact message review/archive
- Admin resume request review, reject, and revoke status updates

## GitHub Pages Limitations

GitHub Pages cannot run trusted server code. The following original server-side features are not available in the static deployment:

- Next.js Server Actions
- Next.js API route handlers
- Firebase Admin SDK runtime operations
- Secure resume approval token generation
- Secure resume token verification at `/resume/access/[token]`

Do not recreate resume token generation in browser code. The token secret and token hashing must stay server-side. Use Vercel, Firebase Functions, or another trusted server runtime if protected resume download links are required.

Dynamic project detail pages are generated at build time for known static project slugs. New Firestore projects can appear in the project listing after hydration, but brand-new detail page URLs require a rebuild or a different client-side detail route strategy.

## Local Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

The static output is generated in `out/`.
