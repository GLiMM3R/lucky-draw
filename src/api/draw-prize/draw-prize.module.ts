import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma/prisma.module';
import { LanguageModule } from '../../config/lang/language.module';
import { FileUploadModule } from '../../services/file-upload/file-upload.module';
import { DrawPrizeController } from './draw-prize.controller';
import { DrawPrizeService } from './draw-prize.service';
import { LoggerService } from '../../services/logger/logger.service';

@Module({
    imports: [PrismaModule, LanguageModule, FileUploadModule],
    controllers: [DrawPrizeController],
    providers: [DrawPrizeService, LoggerService],
})
export class DrawPrizeModule {}
