import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECTID,
      clientEmail: process.env.CLIENTEMAIL,
      privateKey: process.env.PRIVATEKEY
        ? process.env.PRIVATEKEY.replace(/\\n/g, "\n")
        : undefined,
    }),
    databaseURL: process.env.NEXT_PUBLIC_DATABASEURL,
  });
}

export const adminAuth = admin.auth();
export const rtdb = admin.database();
