# Deployment

## GitHub Pages

This repository is configured for free GitHub Pages deployment with `output: "export"` and the workflow in `.github/workflows/deploy-github-pages.yml`.

1. Push the repository to GitHub.
2. Open repository Settings, Pages.
3. Set Source to `GitHub Actions`.
4. Add the required `NEXT_PUBLIC_*` Firebase values under Settings, Secrets and variables, Actions, Variables.
5. Push to the `main` branch.

For `https://USERNAME.github.io/`, leave `NEXT_PUBLIC_BASE_PATH` blank. For `https://USERNAME.github.io/REPOSITORY-NAME/`, set `NEXT_PUBLIC_BASE_PATH` to `/REPOSITORY-NAME`.

See `GITHUB_PAGES.md` for the full checklist.

## Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Add the variables from `.env.example` in Vercel Project Settings.
4. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
5. Deploy from the main branch.

Use Vercel or another trusted server runtime if you want to restore secure resume approval-token generation and verification.

## Firebase

1. Create a Firebase project.
2. Enable Authentication with the email/password provider.
3. Create a Firestore database.
4. Add the Firebase web app config to the public environment variables.
5. Deploy Firestore rules with `firebase deploy --only firestore:rules`.
6. Add an admin custom claim to the owner account from a trusted local/server environment:

```bash
node scripts/set-admin-claim.mjs owner@example.com
```

## Images

The first version stores image URLs. Cloudinary unsigned uploads can be connected with `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET`, or images can be entered manually from any trusted public image host.
