import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';

@Injectable()
export class FilesService {
  private readonly maxFileSize: number;
  private readonly maxFilesPerProject: number;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {
    // Get file size limit from env (default 50MB)
    this.maxFileSize = parseInt(
      this.configService.get<string>('MAX_FILE_SIZE') || '52428800',
      10,
    );

    // Get max files per project from env (default 10, 0 = unlimited)
    this.maxFilesPerProject = parseInt(
      this.configService.get<string>('MAX_FILES_PER_PROJECT') || '10',
      10,
    );

    console.log(`📁 File Upload Configuration:`);
    console.log(`  Max File Size: ${this.formatBytes(this.maxFileSize)}`);
    console.log(
      `  Max Files Per Project: ${this.maxFilesPerProject === 0 ? 'Unlimited' : this.maxFilesPerProject}`,
    );
  }

  /**
   * Upload a file to Supabase
   */
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    // Validate file size
    if (this.maxFileSize > 0 && file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.formatBytes(this.maxFileSize)}`,
      );
    }

    // Upload to Supabase
    const { fileUrl } = await this.supabaseService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    return {
      fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  }

  /**
   * Delete a file from Supabase
   */
  async deleteFile(fileUrl: string): Promise<void> {
    return await this.supabaseService.deleteFileByUrl(fileUrl);
  }

  /**
   * Get max files allowed per project
   */
  getMaxFilesPerProject(): number {
    return this.maxFilesPerProject;
  }

  /**
   * Format bytes to human readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
