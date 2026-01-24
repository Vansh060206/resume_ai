import { NextResponse } from 'next/server';
import ExportService from '@/lib/services/exportService';
import SkillRoadmapGenerator from '@/lib/services/skillRoadmapGenerator';

/**
 * POST /api/roadmap - Generate a skill roadmap and download as PDF/DOCX
 */
export async function POST(req) {
    try {
        const { searchParams } = new URL(req.url);
        const format = searchParams.get('format') || 'download-pdf';

        const data = await req.json();
        const skill = data?.skill;
        const days = Number.parseInt(data?.days, 10);
        const role = data?.role;

        if (!skill || !Number.isFinite(days)) {
            return NextResponse.json(
                { success: false, error: 'Skill and valid days are required' },
                { status: 400 }
            );
        }

        const generator = new SkillRoadmapGenerator();
        const roadmapResult = await generator.generateSkillRoadmap({ skill, days, role });

        if (!roadmapResult?.success) {
            return NextResponse.json(
                { success: false, error: 'Failed to generate roadmap' },
                { status: 500 }
            );
        }

        if (format === 'download-pdf') {
            return await handlePdfDownload(roadmapResult.data);
        }
        if (format === 'download-docx') {
            return await handleDocxDownload(roadmapResult.data);
        }

        return NextResponse.json(
            { success: false, error: 'Invalid format. Use download-pdf or download-docx' },
            { status: 400 }
        );
    } catch (err) {
        console.error('ROADMAP API ERROR:', err);
        return NextResponse.json(
            { success: false, error: `Roadmap generation failed: ${err.message}` },
            { status: 500 }
        );
    }
}

function getSafeFilename(skill, extension) {
    const slug = String(skill).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    return `${slug || 'skill'}_roadmap_${timestamp}.${extension}`;
}

async function handlePdfDownload(roadmapData) {
    const filename = getSafeFilename(roadmapData.skill, 'pdf');
    const pdfBuffer = await ExportService.generateSkillRoadmapPdf(roadmapData);
    return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': pdfBuffer.length.toString(),
        },
    });
}

async function handleDocxDownload(roadmapData) {
    const filename = getSafeFilename(roadmapData.skill, 'docx');
    const docxBuffer = await ExportService.generateSkillRoadmapDocx(roadmapData);
    return new NextResponse(docxBuffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': docxBuffer.length.toString(),
        },
    });
}
