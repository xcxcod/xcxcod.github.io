# IT Student Portfolio

A professional full-stack portfolio for an Information Technology student. It presents public profile content, projects, skills, contact submissions, and a protected resume request workflow without inventing experience or exposing private resume files.

## Stack

- Next.js App Router
- TypeScript and React
- Tailwind CSS
- Firebase Authentication
- Firestore
- Static export for GitHub Pages
- Firebase Admin SDK files retained only for trusted server deployments
- Vitest and Testing Library
- GitHub Pages deployment through GitHub Actions

## Architecture

The GitHub Pages build is a static Next.js export. Public content starts from safe placeholder data, then hydrates from Firestore in the browser with the Firebase web SDK. Public forms validate with Zod in the browser before writing to Firestore. Admin pages use Firebase Auth and Firestore Security Rules for authorization.

Trusted server workflows such as secure resume token generation cannot run on GitHub Pages. Use Vercel, Firebase Functions, or another server runtime for protected resume download links.

Core folders:

- `src/app`: routes and layouts
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
- `NEXT_PUBLIC_BASE_PATH`

Server-only values, not required for GitHub Pages:

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

The `/admin` route requires Firebase Auth. Firestore writes require an `admin: true` custom claim enforced by Firestore rules. A static deployment must not rely on hiding frontend routes for security.

## Testing

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Security Notes

- Firebase Admin credentials are server-only.
- Secure resume approval links require a trusted server runtime and are disabled in the GitHub Pages build.
- Forms include Zod validation and a hidden honeypot field.
- `.env` files are ignored.
- The resume PDF is intentionally not public in the first version.

## GitHub Pages

See [GITHUB_PAGES.md](./GITHUB_PAGES.md) for setup steps, required repository variables, and static hosting limitations.
