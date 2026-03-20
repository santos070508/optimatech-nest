import { Injectable }    from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs   from 'fs';
import * as path from 'path';
import { FileStoragePort } from '../domain/file-storage.port';

@Injectable()
export class LocalDiskStorage implements FileStoragePort {
  private readonly uploadDir: string;
  constructor(private readonly config: ConfigService) {
    this.uploadDir = path.resolve(this.config.get<string>('app.upload.dir', 'uploads'));
    if (!fs.existsSync(this.uploadDir)) fs.mkdirSync(this.uploadDir, { recursive: true });
  }
  async save(file: Express.Multer.File): Promise<string> {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `img_${Date.now()}_${Math.random().toString(36).slice(2,6)}${ext}`;
    fs.writeFileSync(path.join(this.uploadDir, name), file.buffer);
    return `/uploads/${name}`;
  }
  async saveBase64(b64: string): Promise<string> {
    const m = b64.match(/^data:(image\/[\w+]+);base64,(.+)$/);
    if (!m) return '';
    const ext  = m[1].split('/')[1].replace('jpeg','jpg');
    const name = `img_${Date.now()}_${Math.random().toString(36).slice(2,6)}.${ext}`;
    fs.writeFileSync(path.join(this.uploadDir, name), Buffer.from(m[2],'base64'));
    return `/uploads/${name}`;
  }
}
