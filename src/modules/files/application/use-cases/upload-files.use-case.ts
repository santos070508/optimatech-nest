import { Injectable, Inject } from '@nestjs/common';
import { FileStoragePort, FILE_STORAGE } from '../../domain/file-storage.port';

@Injectable()
export class UploadFilesUseCase {
  constructor(
    @Inject(FILE_STORAGE) private readonly storage: FileStoragePort,
  ) {}

  executeMultipart(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map(f => this.storage.save(f)));
  }

  async executeBase64(images: string[]): Promise<string[]> {
    const results = await Promise.all(images.slice(0, 5).map(b => this.storage.saveBase64(b)));
    return results.filter(Boolean);
  }
}
