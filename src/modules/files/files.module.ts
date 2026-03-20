import { Module }        from '@nestjs/common';
import { ConfigModule }  from '@nestjs/config';
import { FilesController }    from './infrastructure/http/files.controller';
import { UploadFilesUseCase } from './application/use-cases/upload-files.use-case';
import { LocalDiskStorage }   from './infrastructure/local-disk.storage';
import { FILE_STORAGE }       from './domain/file-storage.port';

@Module({
  imports:     [ConfigModule],
  controllers: [FilesController],
  providers: [
    UploadFilesUseCase,
    { provide: FILE_STORAGE, useClass: LocalDiskStorage },
  ],
})
export class FilesModule {}
