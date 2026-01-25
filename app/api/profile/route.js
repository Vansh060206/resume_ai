import { NextResponse } from 'next/server'
import { adminAuth, rtdb } from '@/app/firebase/admin'

/**
 * Helper: Verify Firebase token and get userId
 */
async function getUserIdFromRequest(req) {
  const authHeader = req.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized')
  }

  const token = authHeader.split('Bearer ')[1]
  const decoded = await adminAuth.verifyIdToken(token)

  return decoded.uid
}

/**
 * GET /api/profile
 * Get logged-in user's profile with subscription and resume stats
 */
export async function GET(req) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    const decoded = await adminAuth.verifyIdToken(token)
    const userId = decoded.uid

    // Get user profile
    const userSnapshot = await rtdb.ref(`users/${userId}`).get()
    const userData = userSnapshot.exists() ? userSnapshot.val() : {}

    // Get user's resumes count
    const resumesSnapshot = await rtdb.ref(`resumes/${userId}`).get()
    const resumesCount = resumesSnapshot.exists() 
      ? Object.keys(resumesSnapshot.val()).length 
      : 0

    // Determine subscription/plan
    const plan = userData.plan || 'free'
    const subscription = plan === 'free' ? 'free' : plan === 'premium' ? 'premium' : 'free'
    
    // Set resume limits based on plan
    const resumeLimit = plan === 'premium' ? 100 : plan === 'pro' ? 50 : 10

    const userProfile = {
      fullName: userData.fullName || '',
      email: userData.email || decoded.email || '',
      phone: userData.phone || '',
      location: userData.location || '',
      bio: userData.bio || '',
      jobTitle: userData.jobTitle || '',
      subscription,
      plan,
      resumesAnalyzed: resumesCount,
      resumeLimit,
      createdAt: userData.createdAt || Date.now(),
    }

    return NextResponse.json(
      {
        success: true,
        data: userProfile,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('GET PROFILE ERROR:', err.message)

    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

/**
 * PUT /api/profile
 * Update logged-in user's profile
 */
export async function PUT(req) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    const decoded = await adminAuth.verifyIdToken(token)
    const userId = decoded.uid

    const data = await req.json()

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'No data provided' },
        { status: 400 }
      )
    }

    const userData = {
      fullName: data.fullName ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      location: data.location ?? '',
      bio: data.bio ?? '',
      jobTitle: data.jobTitle ?? '',
      updatedAt: Date.now(),
    }

    // ✅ Save to Firebase Realtime Database
    await rtdb.ref(`users/${userId}`).update(userData)

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        data: userData,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('UPDATE PROFILE ERROR:', err.message)

    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }
}
