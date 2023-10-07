import { Module } from '@nestjs/common';
import { PrizeService } from './prize.service';
import { PrizeController } from './prize.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { LanguageModule } from 'src/config/lang/language.module';
import { FileUploadModule } from 'src/services/file-upload/file-upload.module';

@Module({
    imports: [PrismaModule, LanguageModule, FileUploadModule],
    controllers: [PrizeController],
    providers: [PrizeService],
})
export class PrizeModule {}
