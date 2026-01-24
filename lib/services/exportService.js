/**
 * Export Service
 * Generates PDF, DOCX, JSON, and Markdown exports of analysis results
 */

import { jsPDF } from 'jspdf';
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    convertInchesToTwip,
} from 'docx';

class ExportService {
    static generateJsonExport(analysisData) {
        const exportData = {
            exportedAt: new Date().toISOString(),
            version: '2.0',
            analysis: analysisData,
        };

        return JSON.stringify(exportData, null, 2);
    }

    static generateHtmlReport(analysisData) {
        const aiAnalysis = analysisData.ai_analysis || {};
        const atsScore = analysisData.ats_score || {};
        const skills = analysisData.skills || {};
        const roadmap = analysisData.roadmap || {};

        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        // Get score color
        const getScoreColor = (score) => {
            if (score >= 85) return '#10b981'; // green
            if (score >= 70) return '#3b82f6'; // blue
            if (score >= 50) return '#f59e0b'; // orange
            return '#ef4444'; // red
        };

        // Get score label
        const getScoreLabel = (score) => {
            if (score >= 90) return 'Excellent';
            if (score >= 80) return 'Very Good';
            if (score >= 70) return 'Good';
            if (score >= 60) return 'Average';
            if (score >= 50) return 'Below Average';
            return 'Needs Improvement';
        };

        const overallScore = aiAnalysis.overallScore || 0;
        const scoreColor = getScoreColor(overallScore);
        const scoreLabel = getScoreLabel(overallScore);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Analysis Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            font-size: 1.1em;
            opacity: 0.95;
        }
        
        .header .date {
            margin-top: 20px;
            font-size: 0.95em;
            opacity: 0.85;
        }
        
        .score-hero {
            padding: 50px 40px;
            text-align: center;
            background: linear-gradient(to bottom, #f9fafb, white);
            border-bottom: 3px solid #e5e7eb;
        }
        
        .score-circle {
            width: 200px;
            height: 200px;
            margin: 0 auto 30px;
            border-radius: 50%;
            background: white;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            border: 8px solid ${scoreColor};
        }
        
        .score-number {
            font-size: 4em;
            font-weight: 800;
            color: ${scoreColor};
            line-height: 1;
        }
        
        .score-total {
            font-size: 1.2em;
            color: #6b7280;
            margin-top: 5px;
        }
        
        .score-label {
            font-size: 1.5em;
            font-weight: 600;
            color: ${scoreColor};
            margin-bottom: 15px;
        }
        
        .score-summary {
            font-size: 1.1em;
            color: #4b5563;
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.8;
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 50px;
        }
        
        .section-title {
            font-size: 1.8em;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 3px solid #667eea;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .section-title::before {
            content: '';
            width: 6px;
            height: 30px;
            background: linear-gradient(to bottom, #667eea, #764ba2);
            border-radius: 3px;
        }
        
        .score-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .score-card {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid #e5e7eb;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .score-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .score-card-value {
            font-size: 2.5em;
            font-weight: 800;
            color: #667eea;
            margin-bottom: 8px;
        }
        
        .score-card-label {
            font-size: 1em;
            color: #6b7280;
            font-weight: 600;
            text-transform: capitalize;
        }
        
        .ats-section {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #10b981;
            margin-bottom: 30px;
        }
        
        .ats-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        
        .ats-score {
            font-size: 2.5em;
            font-weight: 800;
            color: #10b981;
        }
        
        .ats-badge {
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1em;
        }
        
        .ats-categories {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .ats-category {
            background: white;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
        }
        
        .ats-category-score {
            font-size: 1.5em;
            font-weight: 700;
            color: #059669;
        }
        
        .ats-category-label {
            font-size: 0.85em;
            color: #6b7280;
            margin-top: 5px;
        }
        
        .list-section {
            margin-bottom: 40px;
        }
        
        .list-section h3 {
            font-size: 1.4em;
            color: #1f2937;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .strength-item, .improvement-item, .recommendation-item {
            padding: 15px 20px;
            margin-bottom: 12px;
            border-radius: 10px;
            display: flex;
            align-items: flex-start;
            gap: 15px;
        }
        
        .strength-item {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border-left: 4px solid #10b981;
        }
        
        .improvement-item {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
        }
        
        .recommendation-item {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-left: 4px solid #3b82f6;
        }
        
        .item-icon {
            font-size: 1.3em;
            font-weight: 700;
            min-width: 30px;
        }
        
        .strength-item .item-icon {
            color: #10b981;
        }
        
        .improvement-item .item-icon {
            color: #f59e0b;
        }
        
        .recommendation-item .item-icon {
            color: #3b82f6;
        }
        
        .item-text {
            flex: 1;
            line-height: 1.6;
            color: #374151;
        }
        
        .skills-section {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #3b82f6;
        }
        
        .skills-header {
            margin-bottom: 20px;
        }
        
        .role-badge {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 10px 25px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1.1em;
            margin-bottom: 15px;
        }
        
        .skills-stats {
            display: flex;
            gap: 30px;
            margin-top: 15px;
            flex-wrap: wrap;
        }
        
        .skill-stat {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .skill-stat-number {
            font-size: 2em;
            font-weight: 800;
            color: #3b82f6;
        }
        
        .skill-stat-label {
            color: #6b7280;
            font-size: 0.95em;
        }
        
        .roadmap-section {
            background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #8b5cf6;
        }
        
        .roadmap-time {
            font-size: 1.3em;
            color: #8b5cf6;
            font-weight: 600;
            margin-bottom: 25px;
        }
        
        .phase {
            background: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 15px;
            border-left: 5px solid #8b5cf6;
        }
        
        .phase-header {
            font-size: 1.2em;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .phase-detail {
            color: #6b7280;
            margin-bottom: 8px;
        }
        
        .phase-detail strong {
            color: #374151;
        }
        
        .footer {
            background: #f9fafb;
            padding: 30px 40px;
            text-align: center;
            border-top: 2px solid #e5e7eb;
        }
        
        .footer-logo {
            font-size: 1.5em;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        
        .footer-text {
            color: #6b7280;
            font-size: 0.95em;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                border-radius: 0;
            }
            
            .score-card:hover {
                transform: none;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Resume Analysis Report</h1>
            <div class="subtitle">Comprehensive AI-Powered Resume Evaluation</div>
            <div class="date">Generated on ${formattedDate}</div>
        </div>
        
        <div class="score-hero">
            <div class="score-circle">
                <div class="score-number">${overallScore}</div>
                <div class="score-total">/100</div>
            </div>
            <div class="score-label">${scoreLabel}</div>
            <div class="score-summary">${aiAnalysis.summary || 'Your resume has been analyzed comprehensively. Review the detailed breakdown below for specific insights.'}</div>
        </div>
        
        <div class="content">
            <!-- Detailed Scores -->
            <div class="section">
                <h2 class="section-title">Detailed Score Breakdown</h2>
                <div class="score-grid">
                    ${Object.entries(aiAnalysis.scores || {}).map(([category, score]) => `
                        <div class="score-card">
                            <div class="score-card-value">${score}</div>
                            <div class="score-card-label">${category}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- ATS Score -->
            <div class="section">
                <h2 class="section-title">ATS Compatibility</h2>
                <div class="ats-section">
                    <div class="ats-header">
                        <div>
                            <div style="color: #059669; font-weight: 600; margin-bottom: 5px;">ATS Score</div>
                            <div class="ats-score">${atsScore.overall_score || 0}/100</div>
                        </div>
                        <div class="ats-badge">${atsScore.ats_friendly ? '✅ ATS Friendly' : '⚠️ Needs Work'}</div>
                    </div>
                    <div class="ats-categories">
                        ${Object.entries(atsScore.category_scores || {}).map(([category, score]) => `
                            <div class="ats-category">
                                <div class="ats-category-score">${score.toFixed(0)}</div>
                                <div class="ats-category-label">${category.replace(/_/g, ' ')}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Strengths -->
            <div class="list-section">
                <h3>✅ Key Strengths</h3>
                ${(aiAnalysis.strengths || []).map((strength, i) => `
                    <div class="strength-item">
                        <div class="item-icon">${i + 1}</div>
                        <div class="item-text">${strength}</div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Improvements -->
            <div class="list-section">
                <h3>⚠️ Areas for Improvement</h3>
                ${(aiAnalysis.improvements || []).map((improvement, i) => `
                    <div class="improvement-item">
                        <div class="item-icon">${i + 1}</div>
                        <div class="item-text">${improvement}</div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Recommendations -->
            <div class="list-section">
                <h3>💡 Actionable Recommendations</h3>
                ${(aiAnalysis.recommendations || []).map((rec, i) => `
                    <div class="recommendation-item">
                        <div class="item-icon">${i + 1}</div>
                        <div class="item-text">${rec}</div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Skills Analysis -->
            <div class="section">
                <h2 class="section-title">Skills Analysis</h2>
                <div class="skills-section">
                    <div class="skills-header">
                        <div class="role-badge">🎯 ${skills.detected_role || 'Software Engineer'}</div>
                        <div class="skills-stats">
                            <div class="skill-stat">
                                <div class="skill-stat-number">${skills.current?.total_technical || 0}</div>
                                <div class="skill-stat-label">Technical Skills</div>
                            </div>
                            <div class="skill-stat">
                                <div class="skill-stat-number">${skills.current?.total_soft || 0}</div>
                                <div class="skill-stat-label">Soft Skills</div>
                            </div>
                            <div class="skill-stat">
                                <div class="skill-stat-number">${skills.skill_gap_count || 0}</div>
                                <div class="skill-stat-label">Skill Gaps</div>
                            </div>
                        </div>
                    </div>
                    ${(skills.suggested || []).length > 0 ? `
                        <div style="margin-top: 25px;">
                            <h4 style="color: #1f2937; font-size: 1.1em; margin-bottom: 15px; font-weight: 600;">📚 Recommended Skills to Learn:</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                                ${(skills.suggested || []).map(skill => `
                                    <span style="background: white; padding: 8px 16px; border-radius: 20px; color: #3b82f6; font-weight: 600; border: 2px solid #3b82f6;">${skill}</span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Learning Roadmap -->
            ${(roadmap.phases || []).length > 0 ? `
                <div class="section">
                    <h2 class="section-title">Learning Roadmap</h2>
                    <div class="roadmap-section">
                        <div class="roadmap-time">⏱️ Estimated Time: ${roadmap.total_time || 'N/A'}</div>
                        ${(roadmap.phases || []).map(phase => `
                            <div class="phase">
                                <div class="phase-header">Phase ${phase.phase}: ${phase.name}</div>
                                <div class="phase-detail"><strong>Duration:</strong> ${phase.duration}</div>
                                <div class="phase-detail"><strong>Focus:</strong> ${phase.focus}</div>
                                ${phase.skills ? `<div class="phase-detail"><strong>Skills:</strong> ${phase.skills.join(', ')}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <div class="footer-logo">ResumeAI</div>
            <div class="footer-text">Powered by AI | Making Resume Analysis Simple & Effective</div>
        </div>
    </div>
</body>
</html>`;
    }

    static generateMarkdownReport(analysisData) {
        const aiAnalysis = analysisData.ai_analysis || {};
        const atsScore = analysisData.ats_score || {};
        const skills = analysisData.skills || {};
        const roadmap = analysisData.roadmap || {};

        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        let report = `# Resume Analysis Report

**Generated:** ${formattedDate}

---

## Overall Score: ${aiAnalysis.overallScore || 0}/100

${aiAnalysis.summary || ''}

---

## Detailed Scores

| Category | Score |
|----------|-------|
| Formatting | ${aiAnalysis.scores?.formatting || 0}/100 |
| Content | ${aiAnalysis.scores?.content || 0}/100 |
| Experience | ${aiAnalysis.scores?.experience || 0}/100 |
| Skills | ${aiAnalysis.scores?.skills || 0}/100 |
| Education | ${aiAnalysis.scores?.education || 0}/100 |
| Impact | ${aiAnalysis.scores?.impact || 0}/100 |

---

## ATS Compatibility Score: ${atsScore.overall_score || 0}/100

**Status:** ${atsScore.ats_friendly ? '✅ ATS Friendly' : '⚠️ Needs Improvement'}

### Category Breakdown

`;

        // Add ATS category scores
        for (const [category, score] of Object.entries(atsScore.category_scores || {})) {
            const formattedCategory = category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            report += `- **${formattedCategory}:** ${score.toFixed(1)}/100\n`;
        }

        report += '\n---\n\n## Strengths\n\n';
        (aiAnalysis.strengths || []).forEach((strength, i) => {
            report += `${i + 1}. ${strength}\n`;
        });

        report += '\n## Areas for Improvement\n\n';
        (aiAnalysis.improvements || []).forEach((improvement, i) => {
            report += `${i + 1}. ${improvement}\n`;
        });

        report += '\n---\n\n## Skills Analysis\n\n';
        report += `**Detected Role:** ${skills.detected_role || 'N/A'}\n\n`;

        const currentSkills = skills.current || {};
        report += `**Total Technical Skills:** ${currentSkills.total_technical || 0}\n`;
        report += `**Total Soft Skills:** ${currentSkills.total_soft || 0}\n\n`;

        report += '### Recommended Skills to Learn\n\n';
        (skills.suggested || []).forEach((skill) => {
            report += `- ${skill}\n`;
        });

        report += '\n---\n\n## Learning Roadmap\n\n';
        report += `**Estimated Time:** ${roadmap.total_time || 'N/A'}\n\n`;

        (roadmap.phases || []).forEach((phase) => {
            report += `### Phase ${phase.phase}: ${phase.name}\n`;
            report += `**Duration:** ${phase.duration}\n`;
            report += `**Focus:** ${phase.focus}\n`;
            report += `**Skills:** ${phase.skills?.join(', ') || ''}\n\n`;
        });

        report += '\n---\n\n## Recommendations\n\n';
        (aiAnalysis.recommendations || []).forEach((rec, i) => {
            report += `${i + 1}. ${rec}\n`;
        });

        report += '\n---\n\n*Report generated by Resume Analyzer AI*\n';

        return report;
    }

    /**
     * Generate PDF report - returns Buffer
     */
    static async generatePdfReport(analysisData) {
        const aiAnalysis = analysisData.ai_analysis || {};
        const atsScore = analysisData.ats_score || {};
        const skills = analysisData.skills || {};
        const roadmap = analysisData.roadmap || {};

        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;
        const lineHeight = 7;
        const sectionGap = 12;

        const addSection = (title, sub = false) => {
            if (y > 260) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(sub ? 12 : 14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(102, 126, 234); // #667eea
            doc.text(title, 14, y);
            y += lineHeight + 2;
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
        };

        const addText = (text, indent = 0) => {
            if (y > 275) {
                doc.addPage();
                y = 20;
            }
            const lines = doc.splitTextToSize(text, pageWidth - 28 - indent);
            doc.setFontSize(10);
            doc.text(lines, 14 + indent, y);
            y += lines.length * lineHeight + 2;
        };

        // Header
        doc.setFillColor(102, 126, 234);
        doc.rect(0, 0, pageWidth, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont(undefined, 'bold');
        doc.text('Resume Analysis Report', 14, 18);
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 14, 26);
        y = 45;
        doc.setTextColor(0, 0, 0);

        // Overall Score
        addSection('Overall Score');
        doc.setFontSize(36);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text(`${aiAnalysis.overallScore || 0}/100`, 14, y);
        y += lineHeight + 4;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        addText(aiAnalysis.summary || 'Your resume has been analyzed comprehensively.');

        y += sectionGap;

        // Detailed Scores
        addSection('Detailed Scores');
        if (aiAnalysis.scores) {
            Object.entries(aiAnalysis.scores).forEach(([cat, score]) => {
                addText(`${cat.charAt(0).toUpperCase() + cat.slice(1)}: ${score}/100`);
            });
        }
        y += sectionGap;

        // ATS
        addSection('ATS Compatibility');
        addText(`ATS Score: ${atsScore.overall_score || 0}/100 - ${atsScore.ats_friendly ? 'ATS Friendly' : 'Needs Improvement'}`);
        if (atsScore.category_scores) {
            Object.entries(atsScore.category_scores).forEach(([cat, score]) => {
                addText(`  • ${cat.replace(/_/g, ' ')}: ${score.toFixed(0)}/100`, 5);
            });
        }
        y += sectionGap;

        // Strengths
        addSection('Key Strengths');
        (aiAnalysis.strengths || []).forEach((s, i) => addText(`${i + 1}. ${s}`));
        y += sectionGap;

        // Improvements
        addSection('Areas for Improvement');
        (aiAnalysis.improvements || []).forEach((s, i) => addText(`${i + 1}. ${s}`));
        y += sectionGap;

        // Recommendations
        addSection('Actionable Recommendations');
        (aiAnalysis.recommendations || []).forEach((s, i) => addText(`${i + 1}. ${s}`));
        y += sectionGap;

        // Skills
        addSection('Skills Analysis');
        addText(`Detected Role: ${skills.detected_role || 'N/A'}`);
        addText(`Technical Skills: ${skills.current?.total_technical || 0} | Soft Skills: ${skills.current?.total_soft || 0} | Skill Gaps: ${skills.skill_gap_count || 0}`);
        if ((skills.suggested || []).length > 0) {
            addText(`Recommended: ${(skills.suggested || []).join(', ')}`);
        }
        y += sectionGap;

        // Roadmap
        if ((roadmap.phases || []).length > 0) {
            addSection('Learning Roadmap');
            addText(`Estimated Time: ${roadmap.total_time || 'N/A'}`);
            (roadmap.phases || []).forEach((p) => {
                addText(`Phase ${p.phase}: ${p.name} - ${p.duration} | ${p.focus}`);
            });
        }

        // Footer
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(107, 114, 128);
            doc.text(`ResumeAI | Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
        }

        return Buffer.from(doc.output('arraybuffer'));
    }

    /**
     * Generate DOCX report - returns Buffer
     */
    static async generateDocxReport(analysisData) {
        const aiAnalysis = analysisData.ai_analysis || {};
        const atsScore = analysisData.ats_score || {};
        const skills = analysisData.skills || {};
        const roadmap = analysisData.roadmap || {};

        const sections = [];
        const addHeading = (text, level = 1) => {
            sections.push(
                new Paragraph({
                    text,
                    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
                    spacing: { before: 240, after: 120 },
                })
            );
        };
        const addPara = (text, bold = false) => {
            sections.push(
                new Paragraph({
                    children: [new TextRun({ text, bold })],
                    spacing: { after: 80 },
                })
            );
        };
        const addBullet = (text) => {
            sections.push(
                new Paragraph({
                    children: [new TextRun({ text: `• ${text}` })],
                    indent: { left: convertInchesToTwip(0.25) },
                    spacing: { after: 60 },
                })
            );
        };

        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        addHeading('Resume Analysis Report');
        addPara(`Generated: ${dateStr}`);
        addPara(' ');

        addHeading('Overall Score', 2);
        addPara(`${aiAnalysis.overallScore || 0}/100`, true);
        addPara(aiAnalysis.summary || 'Your resume has been analyzed comprehensively.');

        addHeading('Detailed Scores', 2);
        if (aiAnalysis.scores) {
            Object.entries(aiAnalysis.scores).forEach(([cat, score]) => {
                addBullet(`${cat.charAt(0).toUpperCase() + cat.slice(1)}: ${score}/100`);
            });
        }

        addHeading('ATS Compatibility', 2);
        addPara(`ATS Score: ${atsScore.overall_score || 0}/100 — ${atsScore.ats_friendly ? 'ATS Friendly' : 'Needs Improvement'}`, true);
        if (atsScore.category_scores) {
            Object.entries(atsScore.category_scores).forEach(([cat, score]) => {
                addBullet(`${cat.replace(/_/g, ' ')}: ${score.toFixed(0)}/100`);
            });
        }

        addHeading('Key Strengths', 2);
        (aiAnalysis.strengths || []).forEach((s, i) => addBullet(`${i + 1}. ${s}`));

        addHeading('Areas for Improvement', 2);
        (aiAnalysis.improvements || []).forEach((s, i) => addBullet(`${i + 1}. ${s}`));

        addHeading('Actionable Recommendations', 2);
        (aiAnalysis.recommendations || []).forEach((s, i) => addBullet(`${i + 1}. ${s}`));

        addHeading('Skills Analysis', 2);
        addPara(`Detected Role: ${skills.detected_role || 'N/A'}`, true);
        addPara(`Technical Skills: ${skills.current?.total_technical || 0} | Soft Skills: ${skills.current?.total_soft || 0} | Skill Gaps: ${skills.skill_gap_count || 0}`);
        if ((skills.suggested || []).length > 0) {
            addPara('Recommended skills to learn:');
            (skills.suggested || []).forEach((s) => addBullet(s));
        }

        if ((roadmap.phases || []).length > 0) {
            addHeading('Learning Roadmap', 2);
            addPara(`Estimated Time: ${roadmap.total_time || 'N/A'}`, true);
            (roadmap.phases || []).forEach((p) => {
                addBullet(`Phase ${p.phase}: ${p.name} — ${p.duration} | Focus: ${p.focus}`);
            });
        }

        addPara(' ');
        addPara('Report generated by ResumeAI — Powered by AI', true);

        const doc = new Document({
            sections: [{
                properties: {},
                children: sections,
            }],
        });

        return await Packer.toBuffer(doc);
    }

    /**
     * Generate Skill Roadmap PDF - returns Buffer
     */
    static async generateSkillRoadmapPdf(roadmapData) {
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;
        const lineHeight = 7;
        const sectionGap = 10;

        const addSection = (title) => {
            if (y > 260) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(13);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(88, 80, 236);
            doc.text(title, 14, y);
            y += lineHeight + 2;
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
        };

        const addText = (text, indent = 0) => {
            if (y > 275) {
                doc.addPage();
                y = 20;
            }
            const lines = doc.splitTextToSize(text, pageWidth - 28 - indent);
            doc.setFontSize(10);
            doc.text(lines, 14 + indent, y);
            y += lines.length * lineHeight + 2;
        };

        const skill = roadmapData.skill || 'Skill';
        const days = roadmapData.days || 0;

        doc.setFillColor(88, 80, 236);
        doc.rect(0, 0, pageWidth, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(`${skill} Roadmap`, 14, 18);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Days: ${days} | Role: ${roadmapData.role || 'Software Engineer'}`, 14, 25);
        y = 40;
        doc.setTextColor(0, 0, 0);

        addSection('Summary');
        addText(roadmapData.summary || `A ${days}-day roadmap for ${skill}.`);
        y += sectionGap;

        if ((roadmapData.objectives || []).length > 0) {
            addSection('Objectives');
            (roadmapData.objectives || []).forEach((obj) => addText(`• ${obj}`));
            y += sectionGap;
        }

        if ((roadmapData.prerequisites || []).length > 0) {
            addSection('Prerequisites');
            (roadmapData.prerequisites || []).forEach((req) => addText(`• ${req}`));
            y += sectionGap;
        }

        if ((roadmapData.daily_plan || []).length > 0) {
            addSection('Daily Plan');
            (roadmapData.daily_plan || []).forEach((dayItem) => {
                addText(`Day ${dayItem.day}: ${dayItem.title}`);
                if (dayItem.focus) addText(`Focus: ${dayItem.focus}`, 4);
                (dayItem.tasks || []).forEach((task) => addText(`- ${task}`, 8));
                y += 2;
            });
            y += sectionGap;
        }

        if ((roadmapData.milestones || []).length > 0) {
            addSection('Milestones');
            (roadmapData.milestones || []).forEach((m) => addText(`• ${m}`));
            y += sectionGap;
        }

        if (roadmapData.resources) {
            addSection('Resources');
            Object.values(roadmapData.resources).forEach((res) => {
                if (!res?.name || !res?.url) return;
                addText(`${res.name} (${res.url})`);
            });
        }

        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(107, 114, 128);
            doc.text(`RoadmapAI | Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
        }

        return Buffer.from(doc.output('arraybuffer'));
    }

    /**
     * Generate Skill Roadmap DOCX - returns Buffer
     */
    static async generateSkillRoadmapDocx(roadmapData) {
        const sections = [];
        const addHeading = (text, level = 1) => {
            sections.push(
                new Paragraph({
                    text,
                    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
                    spacing: { before: 240, after: 120 },
                })
            );
        };
        const addPara = (text, bold = false) => {
            sections.push(
                new Paragraph({
                    children: [new TextRun({ text, bold })],
                    spacing: { after: 80 },
                })
            );
        };
        const addBullet = (text) => {
            sections.push(
                new Paragraph({
                    children: [new TextRun({ text: `• ${text}` })],
                    indent: { left: convertInchesToTwip(0.25) },
                    spacing: { after: 60 },
                })
            );
        };

        const skill = roadmapData.skill || 'Skill';
        const days = roadmapData.days || 0;

        addHeading(`${skill} Roadmap`);
        addPara(`Days: ${days} | Role: ${roadmapData.role || 'Software Engineer'}`);
        addPara(' ');

        addHeading('Summary', 2);
        addPara(roadmapData.summary || `A ${days}-day roadmap for ${skill}.`);

        if ((roadmapData.objectives || []).length > 0) {
            addHeading('Objectives', 2);
            (roadmapData.objectives || []).forEach((obj) => addBullet(obj));
        }

        if ((roadmapData.prerequisites || []).length > 0) {
            addHeading('Prerequisites', 2);
            (roadmapData.prerequisites || []).forEach((req) => addBullet(req));
        }

        if ((roadmapData.daily_plan || []).length > 0) {
            addHeading('Daily Plan', 2);
            (roadmapData.daily_plan || []).forEach((dayItem) => {
                addPara(`Day ${dayItem.day}: ${dayItem.title}`, true);
                if (dayItem.focus) addPara(`Focus: ${dayItem.focus}`);
                (dayItem.tasks || []).forEach((task) => addBullet(task));
            });
        }

        if ((roadmapData.milestones || []).length > 0) {
            addHeading('Milestones', 2);
            (roadmapData.milestones || []).forEach((m) => addBullet(m));
        }

        if (roadmapData.resources) {
            addHeading('Resources', 2);
            Object.values(roadmapData.resources).forEach((res) => {
                if (!res?.name || !res?.url) return;
                addPara(`${res.name}: ${res.url}`);
            });
        }

        const doc = new Document({
            sections: [{
                properties: {},
                children: sections,
            }],
        });

        return await Packer.toBuffer(doc);
    }

    static generateSummaryStats(analysisData) {
        const aiAnalysis = analysisData.ai_analysis || {};
        const atsScore = analysisData.ats_score || {};
        const skills = analysisData.skills || {};

        return {
            overallScore: aiAnalysis.overallScore || 0,
            atsScore: atsScore.overall_score || 0,
            totalSkills: skills.current?.total_technical || 0,
            skillGap: skills.skill_gap_count || 0,
            strengthsCount: aiAnalysis.strengths?.length || 0,
            improvementsCount: aiAnalysis.improvements?.length || 0,
            atsCompatible: atsScore.ats_friendly || false,
            detectedRole: skills.detected_role || 'Unknown',
        };
    }
}

export default ExportService;
