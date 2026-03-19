import {
  Controller, Post, Body, UploadedFiles,
  UseInterceptors, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { memoryStorage } from 'multer';
import { UploadFilesUseCase } from '../../application/use-cases/upload-files.use-case';

class UploadBase64Dto {
  @IsArray()
  @IsString({ each: true })
  images: string[];
}

@ApiTags('files')
@Controller('upload')
export class FilesController {
  constructor(private readonly uploadFiles: UploadFilesUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Subir imágenes (multipart/form-data, máx 5)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { images: { type: 'array', items: { type: 'string', format: 'binary' } } } } })
  @UseInterceptors(FilesInterceptor('images', 5, { storage: memoryStorage() }))
  async uploadMultipart(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ urls: string[] }> {
    const urls = await this.uploadFiles.executeMultipart(files);
    return { urls };
  }

  @Post('base64')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Subir imágenes en base64' })
  async uploadBase64(@Body() dto: UploadBase64Dto): Promise<{ urls: string[] }> {
    const urls = await this.uploadFiles.executeBase64(dto.images);
    return { urls };
  }
}
