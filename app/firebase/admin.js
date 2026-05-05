import admin from "firebase-admin";

try {
  const projectId = process.env.NEXT_PUBLIC_PROJECTID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!admin.apps.length && projectId) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: process.env.NEXT_PUBLIC_clientEmail || process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.NEXT_PUBLIC_privateKey || process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY)
          ? (process.env.NEXT_PUBLIC_privateKey || process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY).replace(/\\n/g, "\n")
          : undefined,
      }),
      databaseURL: process.env.NEXT_PUBLIC_DATABASEURL || process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  }
} catch (error) {
  console.log("Firebase admin initialization skipped/failed:", error.message);
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const rtdb = admin.apps.length ? admin.database() : null;
export const db = rtdb;
