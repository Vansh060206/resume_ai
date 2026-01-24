import { NextResponse } from 'next/server';
import ExportService from '@/lib/services/exportService';

/**
 * POST /api/export - Export analysis in PDF or DOCX format
 */
export async function POST(req) {
    try {
        const { searchParams } = new URL(req.url);
        const format = searchParams.get('format') || 'pdf';

        const data = await req.json();

        if (!data) {
            return NextResponse.json(
                { success: false, error: 'No data provided' },
                { status: 400 }
            );
        }

        if (format === 'download-pdf') {
            return await handlePdfDownload(data);
        }
        if (format === 'download-docx') {
            return await handleDocxDownload(data);
        }

        if (format === 'summary') {
            const summary = ExportService.generateSummaryStats(data);
            return NextResponse.json({ success: true, data: summary }, { status: 200 });
        }

        return NextResponse.json(
            { success: false, error: 'Invalid format. Use download-pdf or download-docx' },
            { status: 400 }
        );
    } catch (err) {
        console.error('EXPORT API ERROR:', err);
        return NextResponse.json(
            { success: false, error: `Export failed: ${err.message}` },
            { status: 500 }
        );
    }
}

async function handlePdfDownload(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `resume_analysis_${timestamp}.pdf`;

    try {
        const pdfBuffer = await ExportService.generatePdfReport(data);
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': pdfBuffer.length.toString(),
            },
        });
    } catch (err) {
        console.error('PDF export error:', err);
        throw err;
    }
}

async function handleDocxDownload(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `resume_analysis_${timestamp}.docx`;

    try {
        const docxBuffer = await ExportService.generateDocxReport(data);
        return new NextResponse(docxBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': docxBuffer.length.toString(),
            },
        });
    } catch (err) {
        console.error('DOCX export error:', err);
        throw err;
    }
}
