import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { LanguageModule } from 'src/config/lang/language.module';
import { CsvModule } from 'nest-csv-parser';
import { FileUploadModule } from 'src/services/file-upload/file-upload.module';
import { DrawController } from './draw.controller';
import { DrawService } from './draw.service';

@Module({
    imports: [PrismaModule, LanguageModule, CsvModule, FileUploadModule],
    controllers: [DrawController],
    providers: [DrawService],
})
export class DrawModule {}
