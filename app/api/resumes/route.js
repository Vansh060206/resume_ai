import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { rtdb } from '@/app/firebase/admin'
import { adminAuth } from '@/app/firebase/admin'

export async function GET(req) {
  try {
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const snapshot = await rtdb.ref(`resumes/${userId}`).get()

    let resumes = snapshot.exists()
      ? Object.entries(snapshot.val()).map(([id, value]) => ({
        id,
        ...value.meta,
      }))
      : []

    // newest first
    resumes.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    const start = (page - 1) * limit
    const paginated = resumes.slice(start, start + limit)

    return NextResponse.json(
      {
        success: true,
        data: {
          resumes: paginated,
          total: resumes.length,
          page,
          limit,
          totalPages: Math.ceil(resumes.length / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('GET RESUMES ERROR:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resumes' },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
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

    const resumeId = uuidv4()
    const createdAt = new Date().toISOString()
    
    const resumeData = {
      meta: {
        fileName: body.fileName || 'resume.pdf',
        fileSize: body.fileSize || 0,
        overallScore: body.ai_analysis?.overallScore ?? 0,
        atsScore: body.ats_score?.overall_score ?? 0,
        createdAt,
      },
      analysis: {
        aiAnalysis: body.ai_analysis || body.aiAnalysis || {},
        atsScore: body.ats_score || body.atsScore || {},
        skills: body.skills || {},
        roadmap: body.roadmap || {},
        riskAnalysis: body.risk_analysis || body.riskAnalysis || {},
      },
      extraction: body.extraction || {},
    }

    await rtdb.ref(`resumes/${userId}/${resumeId}`).set(resumeData)

    return NextResponse.json(
      {
        success: true,
        message: 'Resume analysis saved successfully',
        data: { resumeId },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('SAVE RESUME ERROR:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save resume' },
      { status: 500 }
    )
  }
}
