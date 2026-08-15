# Deployment

## Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Add the variables from `.env.example` in Vercel Project Settings.
4. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
5. Deploy from the main branch.

## Firebase

1. Create a Firebase project.
2. Enable Authentication with the email/password provider.
3. Create a Firestore database.
4. Add the Firebase web app config to the public environment variables.
5. Create a Firebase service account and add its values to server-only variables.
6. Deploy Firestore rules with `firebase deploy --only firestore:rules`.
7. Add an admin custom claim to the owner account:

```bash
node scripts/set-admin-claim.mjs owner@example.com
```

## Images

The first version stores image URLs. Cloudinary unsigned uploads can be connected with `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET`, or images can be entered manually from any trusted public image host.
