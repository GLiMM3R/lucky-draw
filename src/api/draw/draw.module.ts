import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma/prisma.module';
import { LanguageModule } from '../../config/lang/language.module';
import { CsvModule } from 'nest-csv-parser';
import { FileUploadModule } from '../../services/file-upload/file-upload.module';
import { DrawController } from './draw.controller';
import { DrawService } from './draw.service';
import { LoggerService } from '../../services/logger/logger.service';

@Module({
    imports: [PrismaModule, LanguageModule, CsvModule, FileUploadModule],
    controllers: [DrawController],
    providers: [DrawService, LoggerService],
    exports: [DrawService],
})
export class DrawModule {}
