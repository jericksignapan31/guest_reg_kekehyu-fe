import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('OCR')
@Controller('ocr')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OcrController {
  constructor(private ocrService: OcrService) {}

  @Post('scan-id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Scan ID image using OCR' })
  @ApiResponse({ status: 200, description: 'ID scanned successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async scanIdImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file provided');
    }

    return this.ocrService.scanIdImage(file.path);
  }

  @Post('scan-id-base64')
  @ApiOperation({ summary: 'Scan ID from base64 encoded image' })
  @ApiResponse({ status: 200, description: 'ID scanned successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        base64Data: {
          type: 'string',
          description: 'Base64 encoded image data',
        },
        fileName: {
          type: 'string',
          description: 'Original file name',
        },
      },
    },
  })
  async scanIdBase64(@Body() body: { base64Data: string; fileName: string }) {
    return this.ocrService.processBase64Image(body.base64Data, body.fileName);
  }
}
