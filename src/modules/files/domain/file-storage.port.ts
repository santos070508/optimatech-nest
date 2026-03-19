export interface FileStoragePort {
  save(file: Express.Multer.File): Promise<string>;
  saveBase64(base64: string): Promise<string>;
}

export const FILE_STORAGE = Symbol('FILE_STORAGE');
