import { Module } from '@nestjs/common';
import { WheelPrizeService } from './wheel-prize.service';
import { WheelPrizeController } from './wheel-prize.controller';
import { PrismaModule } from '../../config/prisma/prisma.module';
import { LanguageModule } from '../../config/lang/language.module';
import { FileUploadModule } from '../../services/file-upload/file-upload.module';
import { LoggerService } from '../../services/logger/logger.service';

@Module({
    imports: [PrismaModule, LanguageModule, FileUploadModule],
    controllers: [WheelPrizeController],
    providers: [WheelPrizeService, LoggerService],
})
export class WheelPrizeModule {}
