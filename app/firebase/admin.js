import admin from "firebase-admin";

if (!admin.apps.length) {
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

export const adminAuth = admin.auth();
export const rtdb = admin.database();
export const db = rtdb;
