import { NextResponse } from 'next/server'
import { rtdb } from '@/app/firebase/admin'
import { adminAuth } from '@/app/firebase/admin'

export async function GET(req, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    
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

    const snapshot = await rtdb
      .ref(`resumes/${userId}/${id}`)
      .get()

    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id,
          ...snapshot.val(),
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('GET RESUME ERROR:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resume' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/resumes/[id]
 * Update resume metadata
 */
export async function PUT(req, { params }) {
  try {
    const { id } = await params
    const body = await req.json()
    
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
    
    const { fileName, notes } = body

    const ref = rtdb.ref(`resumes/${userId}/${id}`)
    const snapshot = await ref.get()

    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      )
    }

    const updates = {
      ...(fileName && { 'meta/fileName': fileName }),
      ...(notes !== undefined && { 'meta/notes': notes }),
      'meta/updatedAt': new Date().toISOString(),
    }

    await ref.update(updates)

    const updatedSnapshot = await ref.get()

    return NextResponse.json(
      {
        success: true,
        message: 'Resume updated successfully',
        data: {
          id,
          ...updatedSnapshot.val(),
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('UPDATE RESUME ERROR:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to update resume' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/resumes/[id]
 * Delete resume
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params

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

    const ref = rtdb.ref(`resumes/${userId}/${id}`)
    const snapshot = await ref.get()

    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      )
    }

    await ref.remove()

    return NextResponse.json(
      {
        success: true,
        message: 'Resume deleted successfully',
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('DELETE RESUME ERROR:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to delete resume' },
      { status: 500 }
    )
  }
}
