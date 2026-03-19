import { Injectable }    from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs           from 'fs';
import * as path         from 'path';
import { FileStoragePort } from '../../domain/file-storage.port';

@Injectable()
export class LocalDiskStorage implements FileStoragePort {
  private readonly uploadDir: string;

  constructor(private readonly config: ConfigService) {
    this.uploadDir = path.resolve(
      this.config.get<string>('app.upload.dir', 'uploads'),
    );
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async save(file: Express.Multer.File): Promise<string> {
    const ext      = path.extname(file.originalname).toLowerCase();
    const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 6)}${ext}`;
    const dest     = path.join(this.uploadDir, filename);
    fs.writeFileSync(dest, file.buffer);
    return `/uploads/${filename}`;
  }

  async saveBase64(base64: string): Promise<string> {
    const match = base64.match(/^data:(image\/[\w+]+);base64,(.+)$/);
    if (!match) return '';
    const ext      = match[1].split('/')[1].replace('jpeg', 'jpg');
    const buf      = Buffer.from(match[2], 'base64');
    const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`;
    const dest     = path.join(this.uploadDir, filename);
    fs.writeFileSync(dest, buf);
    return `/uploads/${filename}`;
  }
}
