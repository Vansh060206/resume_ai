import { NextResponse } from "next/server"
export const dynamic = 'force-dynamic';
import { db } from "@/app/firebase/admin"

/**
 * GET /api/profile?userId=xxx
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      )
    }

    const ref = db.ref(`users/${userId}/profile`)
    const snapshot = await ref.get()

    const data = snapshot.exists()
      ? snapshot.val()
      : {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
        jobTitle: ""
      }

    // Auto-create profile if missing
    if (!snapshot.exists()) {
      await ref.set(data)
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (err) {
    console.error("GET PROFILE ERROR:", err)
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/profile
 */
export async function PUT(req) {
  try {
    const body = await req.json()
    const { userId, ...profile } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      )
    }

    const ref = db.ref(`users/${userId}/profile`)

    await ref.update({
      fullName: profile.fullName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      location: profile.location || "",
      bio: profile.bio || "",
      jobTitle: profile.jobTitle || "",
      updatedAt: Date.now()
    })

    const updatedSnap = await ref.get()

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedSnap.val()
    })

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err)
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
