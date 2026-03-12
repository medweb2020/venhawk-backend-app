import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private bucketName: string;
  private logoBucketName: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      this.configService.get<string>('SUPABASE_ANON_KEY');
    this.bucketName = this.configService.get<string>('SUPABASE_BUCKET_NAME');
    this.logoBucketName =
      this.configService.get<string>('SUPABASE_LOGO_BUCKET_NAME') ||
      this.bucketName;

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
      return await this.uploadToBucket(
        this.bucketName,
        file,
        filePath,
        mimeType,
        false,
      );
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async uploadLogoFile(
    file: Buffer,
    objectPath: string,
    mimeType: string,
  ): Promise<{ fileUrl: string; filePath: string }> {
    try {
      console.log(`📤 Uploading logo to Supabase: ${objectPath}`);
      return await this.uploadToBucket(
        this.logoBucketName,
        file,
        objectPath,
        mimeType,
        true,
      );
    } catch (error) {
      console.error('❌ Error uploading logo:', error);
      throw new InternalServerErrorException('Failed to upload logo');
    }
  }

  /**
   * Delete a file from Supabase Storage by URL
   * @param fileUrl - The public URL of the file to delete
   */
  async deleteFileByUrl(fileUrl: string): Promise<void> {
    try {
      const location = this.extractStorageLocation(fileUrl);
      if (!location) {
        return;
      }

      console.log(`🗑️  Deleting file from Supabase: ${location.filePath}`);

      const { error } = await this.supabase.storage
        .from(location.bucketName)
        .remove([location.filePath]);

      if (error) {
        console.error('❌ Supabase delete error:', error);
        throw new InternalServerErrorException(
          `Failed to delete file: ${error.message}`,
        );
      }

      console.log(
        `✅ File deleted successfully: ${location.bucketName}/${location.filePath}`,
      );
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  getLogoBucketName(): string {
    return this.logoBucketName;
  }

  private async uploadToBucket(
    bucketName: string,
    file: Buffer,
    objectPath: string,
    mimeType: string,
    upsert: boolean,
  ): Promise<{ fileUrl: string; filePath: string }> {
    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .upload(objectPath, file, {
        contentType: mimeType,
        upsert,
      });

    if (error) {
      console.error('❌ Supabase upload error:', error);
      throw new InternalServerErrorException(
        `Failed to upload file: ${error.message}`,
      );
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(bucketName).getPublicUrl(data.path);

    console.log(`✅ File uploaded successfully: ${publicUrl}`);

    return {
      fileUrl: publicUrl,
      filePath: data.path,
    };
  }

  private extractStorageLocation(
    fileUrl: string,
  ): { bucketName: string; filePath: string } | null {
    try {
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const publicIndex = pathParts.indexOf('public');

      if (publicIndex === -1 || pathParts.length <= publicIndex + 2) {
        return null;
      }

      const bucketName = pathParts[publicIndex + 1];
      const filePath = pathParts.slice(publicIndex + 2).join('/');
      if (!bucketName || !filePath) {
        return null;
      }

      return { bucketName, filePath };
    } catch {
      return null;
    }
  }
}
