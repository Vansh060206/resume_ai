import admin from "firebase-admin";

try {
  if (!admin.apps.length && process.env.NEXT_PUBLIC_PROJECTID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_PROJECTID,
        clientEmail: process.env.NEXT_PUBLIC_clientEmail,
        privateKey: process.env.NEXT_PUBLIC_privateKey
          ? process.env.NEXT_PUBLIC_privateKey.replace(/\\n/g, "\n")
          : undefined,
      }),
      databaseURL: process.env.NEXT_PUBLIC_DATABASEURL,
    });
  }
} catch (error) {
  console.log("Firebase admin initialization skipped/failed:", error.message);
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const rtdb = admin.apps.length ? admin.database() : null;
export const db = rtdb;
