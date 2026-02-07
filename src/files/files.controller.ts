import {
  Controller,
  Post,
  Delete,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesService } from './files.service';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';

@Controller('api/files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    console.log(`📤 Received file upload request: ${file.originalname} (${file.size} bytes)`);

    return await this.filesService.uploadFile(file);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(@Body('fileUrl') fileUrl: string): Promise<void> {
    if (!fileUrl) {
      throw new BadRequestException('File URL is required');
    }

    console.log(`🗑️  Received file delete request: ${fileUrl}`);

    await this.filesService.deleteFile(fileUrl);
  }
}
