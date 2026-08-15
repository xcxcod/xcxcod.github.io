# IT Student Portfolio

A professional full-stack portfolio for an Information Technology student. It presents public profile content, projects, skills, contact submissions, and a protected resume request workflow without inventing experience or exposing private resume files.

## Stack

- Next.js App Router
- TypeScript and React
- Tailwind CSS
- Firebase Authentication
- Firestore
- Firebase Admin SDK for trusted server workflows
- Vitest and Testing Library
- Vercel deployment

## Architecture

Public content is read from Firestore when Firebase Admin variables are configured, with safe placeholder content used for local first-run builds. Public forms use server actions with Zod validation before writing to Firestore. Admin pages use Firebase Auth in the browser, while sensitive operations are checked again on the server with ID token verification.

Core folders:

- `src/app`: routes, layouts, server actions, and admin APIs
- `src/components`: reusable UI, layout, forms, projects, skills, and admin panels
- `src/lib`: Firebase setup, validation, token utilities, sample content, helpers
- `src/services`: Firestore and resume workflow logic
- `src/types`: shared TypeScript models
- `src/__tests__`: focused unit and rendering tests

## Local Setup

```bash
npm install
npm run dev
```

Create `.env.local` using `.env.example`. Do not commit real secrets.

## Environment Variables

Public Firebase web config:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_SITE_URL`

Server-only values:

- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_PROJECT_ID`
- `RESUME_TOKEN_SECRET`
- `ADMIN_EMAILS`

Optional image upload values:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_UPLOAD_PRESET`

## Firebase Setup

Enable email/password Authentication, create Firestore, deploy `firestore.rules`, and set an admin custom claim for the owner. Firestore collections used by the app are:

- `profile`
- `projects`
- `skills`
- `contactMessages`
- `resumeRequests`
- `resumeAccessTokens`

## Admin Setup

The `/admin` route requires Firebase Auth. Firestore writes and admin API calls require an `admin: true` custom claim. `ADMIN_EMAILS` is available as a server-side fallback for API verification, but Firestore rules should rely on the custom claim.

## Testing

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Security Notes

- Firebase Admin credentials are server-only.
- Resume links use random tokens and store only token hashes.
- Resume tokens expire and can be revoked.
- Forms include server-side validation and a hidden honeypot field.
- `.env` files are ignored.
- The resume PDF is intentionally not public in the first version.
