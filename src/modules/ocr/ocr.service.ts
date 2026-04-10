import { Injectable, BadRequestException } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class OcrService {
  async scanIdImage(filePath: string) {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new BadRequestException('File not found');
      }

      // Check file size (limit to 10MB)
      const fileSize = fs.statSync(filePath).size;
      if (fileSize > 10 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds 10MB limit');
      }

      // Run Tesseract OCR
      const result = await Tesseract.recognize(filePath, 'eng', {
        logger: (m) => console.log('OCR Progress:', m),
      });

      const extractedText = result.data.text;

      // Parse extracted text to get ID information
      const parsedData = this.parseIdData(extractedText);

      return {
        success: true,
        extractedText,
        parsedData,
        confidence: result.data.confidence,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`OCR failed: ${errorMessage}`);
    }
  }

  private parseIdData(text: string) {
    // Simple parsing logic - adjust based on ID format
    const lines = text.split('\n').filter((line) => line.trim());

    let name = '';
    let idNumber = '';
    let dateOfBirth = '';
    let nationality = '';

    // Extract name (usually first few lines)
    if (lines.length > 0) {
      name = lines[0];
    }

    // Extract ID number (look for patterns)
    const idPattern = /\d{4}-\d{4}-\d{4}-\d{1}/i;
    const idMatch = text.match(idPattern);
    if (idMatch) {
      idNumber = idMatch[0];
    }

    // Extract date (look for date patterns)
    const datePattern = /\b(\d{2}\/\d{2}\/\d{4})\b/;
    const dateMatch = text.match(datePattern);
    if (dateMatch) {
      dateOfBirth = dateMatch[0];
    }

    return {
      name,
      idNumber,
      dateOfBirth,
      nationality,
      rawText: text,
    };
  }

  async processBase64Image(base64Data: string, fileName: string) {
    try {
      // Convert base64 to buffer
      const buffer = Buffer.from(base64Data, 'base64');

      // Create temporary file
      const tempDir = path.join(process.cwd(), 'uploads', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const filePath = path.join(tempDir, `${Date.now()}_${fileName}`);
      fs.writeFileSync(filePath, buffer);

      // Process image
      const result = await this.scanIdImage(filePath);

      // Clean up temp file
      fs.unlinkSync(filePath);

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Base64 processing failed: ${errorMessage}`);
    }
  }
}
