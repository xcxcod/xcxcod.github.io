import admin from "firebase-admin";

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/set-admin-claim.mjs owner@example.com");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
  })
});

const user = await admin.auth().getUserByEmail(email);
await admin.auth().setCustomUserClaims(user.uid, { admin: true });
console.log(`Admin claim set for ${email}`);
