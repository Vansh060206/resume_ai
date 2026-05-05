import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { v4 as uuidv4 } from 'uuid';
import DocumentExtractor from '@/lib/services/documentExtractor';
import AIAnalyzer from '@/lib/services/aiAnalyzer';
import SkillExtractor from '@/lib/services/skillExtractor';
import ATSScorer from '@/lib/services/atsScorer';
import RoadmapGenerator from '@/lib/services/roadmapGenerator';

/**
 * POST /api/analysis - Analyze resume
 * Complete AI-powered resume analysis
 */
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];

    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Allowed: PDF, DOC, DOCX, TXT' },
        { status: 400 }
      );
    }

    // Process file in memory buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Step 1: Extract text from document
    console.log('📄 Extracting text from document...');
    const extractionResult = await DocumentExtractor.extractText(buffer, fileExtension);

    if (!extractionResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Text extraction failed: ${extractionResult.error || 'Unknown error'}`,
        },
        { status: 500 }
      );
    }

    const resumeText = extractionResult.text;
    console.log('✅ Text extracted:', {
      wordCount: extractionResult.word_count,
      charCount: extractionResult.char_count,
    });

    // Step 1.5: Validate that the file is actually a resume
    const textLower = resumeText.toLowerCase();
    const resumeKeywords = ['experience', 'education', 'skills', 'summary', 'profile', 'work history', 'projects', 'achievements', 'certifications', 'contact', 'curriculum vitae', 'resume', 'employment'];

    // Check for keyword matches
    const keywordMatches = resumeKeywords.filter(k => textLower.includes(k));

    // Resume Validation Logic:
    // 1. Must contain at least 2 resume-specific keywords
    // 2. OR Must contain "resume" or "curriculum vitae" and have sufficient length
    // 3. Must have a minimum length (avoid empty or tiny files)
    const isResume = (keywordMatches.length >= 2) ||
      ((textLower.includes('resume') || textLower.includes('curriculum vitae')) && extractionResult.word_count > 50);

    if (!isResume || extractionResult.word_count < 20) {
      console.warn('⚠️ File does not appear to be a valid resume. Keywords found:', keywordMatches);


      return NextResponse.json(
        {
          success: false,
          error: 'The uploaded file does not appear to be a valid resume. Please ensure it contains sections like Experience, Education, or Skills.'
        },
        { status: 400 }
      );
    }

    // Step 2: Extract skills
    console.log('🔍 Extracting skills...');
    const skillAnalysis = SkillExtractor.analyzeSkills(resumeText);
    console.log('✅ Skills extracted:', {
      technicalSkills: skillAnalysis.current_skills.total_technical,
      softSkills: skillAnalysis.current_skills.total_soft,
      detectedRole: skillAnalysis.detected_role,
    });

    // Step 3: Calculate ATS score
    console.log('📈 Calculating ATS score...');
    const atsResult = ATSScorer.calculateAtsScore(resumeText, skillAnalysis);
    console.log('✅ ATS score calculated:', {
      overallScore: atsResult.overall_ats_score,
      atsFriendly: atsResult.ats_    // Step 4: AI-powered analysis
    let aiResult;
    try {
      console.log('📊 Starting AI analysis...');
      const aiAnalyzer = new AIAnalyzer();
      aiResult = await aiAnalyzer.analyzeResume(resumeText);
      console.log('✅ AI analysis completed');
    } catch (aiErr) {
      console.error('❌ AI Analysis Failed:', aiErr);
      return NextResponse.json(
        { success: false, error: `AI Analysis failed: ${aiErr.message}. Check if your GEMINI_API_KEY is valid.` },
        { status: 500 }
      );
    }

    // Step 5: Generate learning roadmap
    let roadmapResult;
    try {
      console.log('🗺️ Generating learning roadmap...');
      roadmapResult = RoadmapGenerator.generateRoadmap(
        skillAnalysis.suggested_skills,
        skillAnalysis.detected_role
      );
    } catch (roadmapErr) {
      console.error('❌ Roadmap Generation Failed:', roadmapErr);
      roadmapResult = { roadmap: [], total_estimated_time: 'N/A' };
    }

    // Step 6: Save to Database
    let resumeId = null;
    const userId = formData.get('userId');

    if (userId) {
      console.log(`💾 Saving analysis for user: ${userId}`);
      try {
        const { db } = await import('@/app/firebase/admin');
        const database = db;

        if (database) {
          resumeId = uuidv4();
          const timestamp = new Date().toISOString();

          const resumeData = {
            meta: {
              fileName: fileName,
              fileSize: 0,
              fileType: fileExtension,
              overallScore: aiResult.analysis.overallScore || atsResult.overall_ats_score,
              atsScore: atsResult.overall_ats_score,
              trustScore: aiResult.analysis.trustScore || 85,
              createdAt: timestamp,
              status: 'completed'
            },
            analysis: {
              aiAnalysis: aiResult.analysis,
              atsScore: atsResult,
              skills: skillAnalysis,
              roadmap: roadmapResult,
              riskAnalysis: aiResult.analysis.trustAnalysis || {}
            },
            extraction: {
              word_count: extractionResult.word_count,
              char_count: extractionResult.char_count
            },
            status: 'completed',
            userId
          };

          await database.ref(`resumes/${userId}/${resumeId}`).set(resumeData);
          
          const profileRef = database.ref(`users/${userId}/profile`);
          await profileRef.child('resumesAnalyzed').transaction((current) => {
            return (current || 0) + 1;
          });

          console.log('✅ Data saved to Firebase');
        }
      } catch (dbError) {
        console.error('❌ Database Save Failed:', dbError);
        // We don't return 500 here so the user at least gets their analysis results
      }
    }

    // Compile comprehensive response
    const response = {
      success: true,
      data: {
        id: resumeId,
        extraction: {
          word_count: extractionResult.word_count,
          char_count: extractionResult.char_count,
        },
        ai_analysis: aiResult.analysis,
        skills: {
          current: skillAnalysis.current_skills,
          suggested: skillAnalysis.suggested_skills,
          detected_role: skillAnalysis.detected_role,
          skill_gap_count: skillAnalysis.skill_gap_count,
        },
        ats_score: {
          overall_score: atsResult.overall_ats_score,
          category_scores: atsResult.category_scores,
          recommendations: atsResult.recommendations,
          ats_friendly: atsResult.ats_friendly,
        },
        roadmap: {
          items: roadmapResult.roadmap,
          phases: roadmapResult.phases,
          total_time: roadmapResult.total_estimated_time,
          role: roadmapResult.role,
        },
        trust: {
          score: aiResult.analysis.trustScore,
          analysis: aiResult.analysis.trustAnalysis
        }
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    // ... error handling
    console.error('ANALYSIS API ERROR:', err);


    return NextResponse.json(
      { success: false, error: `Analysis failed: ${err.message}` },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analysis/health - Health check
 */
export async function GET(req) {
  return NextResponse.json(
    {
      success: true,
      message: 'Resume Analyzer API is running',
      version: '2.0.0',
    },
    { status: 200 }
  );
}
