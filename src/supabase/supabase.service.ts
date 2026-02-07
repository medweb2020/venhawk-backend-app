import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    this.bucketName = this.configService.get<string>('SUPABASE_BUCKET_NAME');

    if (!supabaseUrl || !supabaseKey || !this.bucketName) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Upload a file to Supabase Storage
   * @param file - The file buffer to upload
   * @param fileName - Original filename
   * @param mimeType - MIME type of the file
   * @returns The public URL of the uploaded file
   */
  async uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<{ fileUrl: string; filePath: string }> {
    try {
      // Generate unique filename with UUID prefix
      const fileExtension = fileName.split('.').pop();
      const uniqueFileName = `${randomUUID()}-${Date.now()}.${fileExtension}`;
      const filePath = `uploads/${uniqueFileName}`;

      console.log(`📤 Uploading file to Supabase: ${filePath}`);

      // Upload file to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          contentType: mimeType,
          upsert: false,
        });

      if (error) {
        console.error('❌ Supabase upload error:', error);
        throw new InternalServerErrorException(
          `Failed to upload file: ${error.message}`,
        );
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(this.bucketName).getPublicUrl(data.path);

      console.log(`✅ File uploaded successfully: ${publicUrl}`);

      return {
        fileUrl: publicUrl,
        filePath: data.path,
      };
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  /**
   * Delete a file from Supabase Storage by URL
   * @param fileUrl - The public URL of the file to delete
   */
  async deleteFileByUrl(fileUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      // URL format: https://xxxxx.supabase.co/storage/v1/object/public/bucket-name/uploads/filename.ext
      const urlParts = fileUrl.split('/');
      const bucketIndex = urlParts.indexOf('public') + 1;
      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      console.log(`🗑️  Deleting file from Supabase: ${filePath}`);

      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('❌ Supabase delete error:', error);
        throw new InternalServerErrorException(
          `Failed to delete file: ${error.message}`,
        );
      }

      console.log(`✅ File deleted successfully: ${filePath}`);
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
