/**
 * AI-Powered Resume Analyzer using Google Gemini
 * Provides comprehensive resume analysis with scoring
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

class AIAnalyzer {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            console.warn('⚠️ GEMINI_API_KEY not configured properly. Using dynamic fallback analysis.');
            this.genAI = null;
            this.model = null;
        } else {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        }
    }

    async analyzeResume(resumeText) {
        // If API key is not configured, use dynamic fallback immediately
        if (!this.model) {
            console.log('🔄 Using dynamic fallback analysis (no API key configured)');
            return this._getDynamicFallbackAnalysis(resumeText);
        }

        const prompt = `You are an expert resume reviewer and career coach with 15+ years of experience. Analyze the following resume thoroughly and provide a comprehensive, specific evaluation.

Resume Text:
${resumeText}

Please provide your analysis in the following JSON format (IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks):

{
    "overallScore": <number between 0-100 based on overall quality>,
    "summary": "<brief 2-3 sentence specific summary highlighting key aspects of THIS resume>",
    "strengths": [
        "<specific strength 1 from this resume>",
        "<specific strength 2 from this resume>",
        "<specific strength 3 from this resume>",
        "<specific strength 4 from this resume>"
    ],
    "improvements": [
        "<specific improvement suggestion 1 for this resume>",
        "<specific improvement suggestion 2 for this resume>",
        "<specific improvement suggestion 3 for this resume>",
        "<specific improvement suggestion 4 for this resume>"
    ],
    "scores": {
        "formatting": <0-100: assess layout, readability, consistency>,
        "content": <0-100: assess clarity, relevance, completeness>,
        "experience": <0-100: assess work history, achievements, progression>,
        "skills": <0-100: assess technical/soft skills, relevance, depth>,
        "education": <0-100: assess qualifications, certifications, relevance>,
        "impact": <0-100: assess quantifiable results, business impact>
    },
    "trustScore": <0-100: estimated authenticity score>,
    "trustAnalysis": {
        "score": <0-100>,
        "level": "<High|Moderate|Low|Critical Risk>",
        "flags": [
            "<specific red flag 1>",
            "<specific red flag 2>"
        ],
        "signals": [
            "<positive authenticity signal 1>",
            "<positive authenticity signal 2>"
        ],
        "reasoning": "<brief explanation of the trust score>"
    },
    "recommendations": [
        "<specific actionable recommendation 1 with concrete steps>",
        "<specific actionable recommendation 2 with concrete steps>",
        "<specific actionable recommendation 3 with concrete steps>",
        "<specific actionable recommendation 4 with concrete steps>"
    ]
}

Evaluation Criteria:
1. FORMATTING (0-100): Structure, readability, consistency, ATS-friendliness
2. CONTENT (0-100): Clarity, relevance, grammar, professional tone
3. EXPERIENCE (0-100): Work history quality, career progression, achievements
4. SKILLS (0-100): Technical/soft skills relevance, depth, demonstrated proficiency
5. EDUCATION (0-100): Academic qualifications, certifications, ongoing learning
6. IMPACT (0-100): Quantifiable results, business value, measurable achievements
7. TRUST SCORE (0-100): Assess for signs of fabrication, specific dates/companies, realistic career trajectory, consistent timeline, and professional language. 80-100 = Safe, 50-79 = Moderate, <50 = Risky.

CRITICAL INSTRUCTIONS:
- Analyze THIS specific resume, not generic advice
- Be specific - mention actual details from the resume
- Scores should reflect the actual quality (be honest, not always 70-80)
- Identify real strengths and actual weaknesses
- Evaluate TRUST SCORE strictly. Look for red flags like:
    - Vague descriptions without specifics
    - Unrealistic job titles for years of experience
    - Missing dates or inconsistent timelines
    - Buzzword stuffing without context
- Provide actionable, specific recommendations
- Return ONLY the JSON object, no additional text, no markdown formatting`;

        try {
            console.log('🤖 Calling Gemini API for AI analysis...');
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let resultText = response.text().trim();

            console.log('📥 Received response from Gemini API');

            // Remove markdown code blocks if present
            if (resultText.startsWith('```')) {
                const parts = resultText.split('```');
                resultText = parts[1];
                if (resultText.startsWith('json')) {
                    resultText = resultText.substring(4);
                }
                resultText = resultText.trim();
            }

            // Remove any leading/trailing whitespace or newlines
            resultText = resultText.replace(/^\s+|\s+$/g, '');

            const analysis = JSON.parse(resultText);

            // Validate structure
            const requiredKeys = ['overallScore', 'summary', 'strengths', 'improvements', 'scores', 'recommendations', 'trustScore', 'trustAnalysis'];
            for (const key of requiredKeys) {
                if (!(key in analysis)) {
                    throw new Error(`Missing required key: ${key}`);
                }
            }

            // Validate scores object
            const requiredScores = ['formatting', 'content', 'experience', 'skills', 'education', 'impact'];
            for (const scoreKey of requiredScores) {
                if (!(scoreKey in analysis.scores)) {
                    throw new Error(`Missing required score: ${scoreKey}`);
                }
            }

            console.log('✅ AI analysis completed successfully');
            return {
                success: true,
                analysis,
            };
        } catch (error) {
            console.error('❌ AI Analysis error:', error.message);
            console.log('🔄 Falling back to dynamic analysis based on resume content');
            return this._getDynamicFallbackAnalysis(resumeText);
        }
    }

    _getDynamicFallbackAnalysis(resumeText) {
        console.log('📊 Generating dynamic fallback analysis...');

        // Analyze the resume text to provide somewhat dynamic feedback
        const text = resumeText.toLowerCase();
        const wordCount = resumeText.split(/\s+/).length;

        // Detect key elements
        const hasEmail = /@/.test(resumeText);
        const hasPhone = /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(resumeText);
        const hasLinkedIn = /linkedin/i.test(resumeText);
        const hasGithub = /github/i.test(resumeText);

        // Experience indicators
        const hasExperience = /(experience|work|employment|position|role)/i.test(resumeText);
        const experienceCount = (resumeText.match(/(19|20)\d{2}/g) || []).length;
        const hasMetrics = /\d+%|\$\d+|million|thousand|increased|decreased|improved/i.test(resumeText);

        // Skills detection
        const hasSkills = /(skills|technologies|proficient|expertise)/i.test(resumeText);
        const technicalSkills = [
            'python', 'java', 'javascript', 'react', 'node', 'sql', 'aws',
            'docker', 'kubernetes', 'git', 'typescript', 'angular', 'vue'
        ].filter(skill => text.includes(skill));

        // Education
        const hasEducation = /(education|degree|university|college|bachelor|master|phd)/i.test(resumeText);
        const hasCertification = /(certification|certified|certificate)/i.test(resumeText);

        // Calculate dynamic scores
        let formattingScore = 50;
        if (hasEmail && hasPhone) formattingScore += 15;
        if (hasLinkedIn) formattingScore += 5;
        if (hasGithub) formattingScore += 5;
        if (wordCount > 200 && wordCount < 1000) formattingScore += 15;
        if (wordCount >= 1000) formattingScore += 10;
        formattingScore = Math.min(formattingScore, 100);

        let contentScore = 50;
        if (hasExperience) contentScore += 15;
        if (hasSkills) contentScore += 15;
        if (hasEducation) contentScore += 10;
        if (wordCount > 300) contentScore += 10;
        contentScore = Math.min(contentScore, 100);

        let experienceScore = 40;
        if (hasExperience) experienceScore += 20;
        if (experienceCount >= 2) experienceScore += 10;
        if (experienceCount >= 4) experienceScore += 10;
        if (hasMetrics) experienceScore += 20;
        experienceScore = Math.min(experienceScore, 100);

        let skillsScore = 40;
        if (hasSkills) skillsScore += 15;
        skillsScore += technicalSkills.length * 5;
        skillsScore = Math.min(skillsScore, 100);

        let educationScore = 50;
        if (hasEducation) educationScore += 25;
        if (hasCertification) educationScore += 15;
        educationScore = Math.min(educationScore, 100);

        let impactScore = 35;
        if (hasMetrics) impactScore += 30;
        if (hasExperience && hasMetrics) impactScore += 20;
        impactScore = Math.min(impactScore, 100);

        const overallScore = Math.round(
            (formattingScore + contentScore + experienceScore + skillsScore + educationScore + impactScore) / 6
        );

        // Generate dynamic strengths
        const strengths = [];
        if (hasEmail && hasPhone) strengths.push('Complete contact information provided');
        if (hasLinkedIn || hasGithub) strengths.push('Professional online presence included');
        if (hasExperience) strengths.push('Work experience section present');
        if (technicalSkills.length > 0) strengths.push(`Technical skills identified: ${technicalSkills.slice(0, 3).join(', ')}`);
        if (hasEducation) strengths.push('Educational background documented');
        if (hasMetrics) strengths.push('Includes quantifiable achievements');
        if (wordCount > 300) strengths.push('Comprehensive content coverage');

        // Ensure at least 4 strengths
        while (strengths.length < 4) {
            strengths.push('Resume contains relevant professional information');
        }

        // Generate dynamic improvements
        const improvements = [];
        if (!hasMetrics) improvements.push('Add quantifiable achievements with specific metrics (percentages, dollar amounts, numbers)');
        if (technicalSkills.length < 3) improvements.push('Expand technical skills section with more relevant technologies');
        if (!hasLinkedIn && !hasGithub) improvements.push('Include LinkedIn profile or GitHub link for professional presence');
        if (experienceCount < 2) improvements.push('Add more detailed work experience with specific dates and accomplishments');
        if (!hasCertification) improvements.push('Include relevant certifications or professional development courses');
        if (wordCount < 300) improvements.push('Expand resume content with more detailed descriptions of roles and achievements');

        // Ensure at least 4 improvements
        while (improvements.length < 4) {
            improvements.push('Consider tailoring resume content to specific job descriptions');
        }

        // Generate dynamic recommendations
        const recommendations = [];
        if (!hasMetrics) {
            recommendations.push('Add measurable results: Instead of "Managed projects", write "Managed 5 cross-functional projects, delivering 20% ahead of schedule"');
        }
        recommendations.push('Use strong action verbs: Led, Implemented, Optimized, Increased, Reduced, Architected, Streamlined');

        if (technicalSkills.length < 5) {
            recommendations.push('Expand skills section with proficiency levels (Expert, Advanced, Intermediate) for each skill');
        }

        if (!hasLinkedIn || !hasGithub) {
            recommendations.push('Create a professional online presence: LinkedIn profile + GitHub portfolio to showcase projects');
        }

        recommendations.push('Tailor your resume for each application by matching keywords from the job description');

        // Calculate dynamic Trust Score
        let trustScore = 75; // Base score
        const trustFlags = [];
        const trustSignals = [];

        if (hasEmail && hasPhone) {
            trustScore += 10;
            trustSignals.push('Verified contact information pattern');
        } else {
            trustScore -= 10;
            trustFlags.push('Incomplete contact information');
        }

        if (hasLinkedIn || hasGithub) {
            trustScore += 5;
            trustSignals.push('Professional online presence linked');
        }

        if (experienceCount >= 2) {
            trustScore += 5;
            trustSignals.push('Consistent work history dates detected');
        } else {
            // Neutral, maybe eager/student
        }

        if (wordCount < 150) {
            trustScore -= 15;
            trustFlags.push('Very low content volume (possible scaffold)');
        } else if (wordCount > 300) {
            trustScore += 5;
            trustSignals.push('Detailed content structure');
        }

        // Cap score
        trustScore = Math.min(Math.max(trustScore, 40), 98);

        // Generate trust analysis
        const trustAnalysis = {
            score: trustScore,
            level: trustScore >= 80 ? 'High' : trustScore >= 60 ? 'Moderate' : 'Low',
            flags: trustFlags,
            signals: trustSignals,
            reasoning: `Trust score based on structural completeness: ${trustSignals.length} positive signals and ${trustFlags.length} potential issues found.`
        };

        const summary = `This resume ${hasExperience ? 'includes work experience' : 'needs work experience'} and ${hasSkills ? 'lists technical skills' : 'requires a skills section'}. ${hasMetrics ? 'Good use of quantifiable achievements.' : 'Adding specific metrics would strengthen impact.'} Overall score: ${overallScore}/100.`;

        console.log('✅ Dynamic fallback analysis generated with Trust Score:', trustScore);

        return {
            success: true,
            analysis: {
                overallScore,
                summary,
                strengths: strengths.slice(0, 4),
                improvements: improvements.slice(0, 4),
                scores: {
                    formatting: formattingScore,
                    content: contentScore,
                    experience: experienceScore,
                    skills: skillsScore,
                    education: educationScore,
                    impact: impactScore,
                },
                trustScore,
                trustAnalysis,
                recommendations: recommendations.slice(0, 4),
            },
        };
    }
}

export default AIAnalyzer;
