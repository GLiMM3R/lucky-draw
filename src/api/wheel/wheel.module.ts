import { Module } from '@nestjs/common';
import { WheelService } from './wheel.service';
import { WheelController } from './wheel.controller';
import { PrismaModule } from '../../config/prisma/prisma.module';
import { LanguageModule } from '../../config/lang/language.module';
import { FileUploadModule } from '../../services/file-upload/file-upload.module';
import { LoggerService } from '../../services/logger/logger.service';

@Module({
    imports: [PrismaModule, FileUploadModule, LanguageModule],
    controllers: [WheelController],
    providers: [WheelService, LoggerService],
    exports: [WheelService],
})
export class WheelModule {}
