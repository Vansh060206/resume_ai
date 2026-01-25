import { NextResponse } from "next/server";
import { adminAuth, rtdb } from "@/app/firebase/admin";
import { sendEmail } from "@/lib/services/mailer";
import { registrationEmail } from "@/lib/emailTemplates/registration";

export async function POST(req) {
  try {
    const { token, fullName } = await req.json();

    if (!token || !fullName) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    // 🔐 Verify token
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    const email = decoded.email;

    // 🗄️ Save user profile
    await rtdb.ref(`users/${uid}`).set({
      fullName,
      email,
      role: "user",
      plan: "free",
      subscription: "free",
      createdAt: Date.now(),
    });

    // 🍪 Set secure cookie
    const response = NextResponse.json({ success: true });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 5, // 5 days
    });

    await sendEmail({
      to : email,
      subject : "Welcome to Resume Analyzer",
      html: registrationEmail({name : fullName}),
    })
    return response;

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
