
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

class DocumentExtractor {
    /**
     * Extract text from PDF using pdf-parse
     */
    static async extractFromPdf(buffer) {
        try {
            const data = await pdfParse(buffer);
            return this.cleanText(data.text);
        } catch (error) {
            throw new Error(`Failed to extract PDF text: ${error.message}`);
        }
    }

    /**
     * Extract text from DOCX files
     */
    static async extractFromDocx(buffer) {
        try {
            const result = await mammoth.extractRawText({ buffer: buffer });
            return this.cleanText(result.value);
        } catch (error) {
            throw new Error(`Failed to extract DOCX text: ${error.message}`);
        }
    }

    /**
     * Extract text from TXT files
     */
    static async extractFromTxt(buffer) {
        try {
            const text = buffer.toString('utf-8');
            return this.cleanText(text);
        } catch (error) {
            throw new Error(`Failed to extract TXT text: ${error.message}`);
        }
    }

    /**
     * Clean and normalize extracted text
     */
    static cleanText(text) {
        // Remove excessive whitespace
        text = text.replace(/\s+/g, ' ');
        // Remove special characters but keep important punctuation
        text = text.replace(/[^\w\s\.\,\@\-\+\#\(\)\/]/g, '');
        // Remove multiple newlines
        text = text.replace(/\n+/g, '\n');
        return text.trim();
    }

    /**
     * Main method to extract text based on file type
     */
    static async extractText(buffer, fileExtension) {
        try {
            let text;

            if (fileExtension.toLowerCase() === 'pdf') {
                text = await this.extractFromPdf(buffer);
            } else if (['docx', 'doc'].includes(fileExtension.toLowerCase())) {
                text = await this.extractFromDocx(buffer);
            } else if (fileExtension.toLowerCase() === 'txt') {
                text = await this.extractFromTxt(buffer);
            } else {
                throw new Error(`Unsupported file format: ${fileExtension}`);
            }

            return {
                success: true,
                text,
                word_count: text.split(/\s+/).length,
                char_count: text.length,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                text: '',
            };
        }
    }
}

export default DocumentExtractor;
