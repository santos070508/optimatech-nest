import { Injectable, Inject } from '@nestjs/common';
import { FileStoragePort, FILE_STORAGE } from '../domain/file-storage.port';

@Injectable()
export class UploadFilesUseCase {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly storage: FileStoragePort,
  ) {}

  async executeMultipart(files: Express.Multer.File[]): Promise<string[]> {
    const urls = await Promise.all(files.map(f => this.storage.save(f)));
    return urls;
  }

  async executeBase64(images: string[]): Promise<string[]> {
    const urls = await Promise.all(
      images.slice(0, 5).map(b64 => this.storage.saveBase64(b64)),
    );
    return urls.filter(Boolean);
  }
}
