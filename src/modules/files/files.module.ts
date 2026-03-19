import { Module }          from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { FilesController }   from './infrastructure/http/files.controller';
import { UploadFilesUseCase } from './application/use-cases/upload-files.use-case';
import { LocalDiskStorage }  from './infrastructure/local-disk.storage';
import { FILE_STORAGE }      from './domain/file-storage.port';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject:  [ConfigService],
      useFactory: (config: ConfigService) => [{
        rootPath:    path.resolve(config.get<string>('app.upload.dir', 'uploads')),
        serveRoot:   '/uploads',
        serveStaticOptions: { index: false },
      }],
    }),
  ],
  controllers: [FilesController],
  providers: [
    UploadFilesUseCase,
    { provide: FILE_STORAGE, useClass: LocalDiskStorage },
  ],
})
export class FilesModule {}
