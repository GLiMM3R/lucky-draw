import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma/prisma.module';
import { WheelReportController } from './wheel-report.controller';
import { WheelReportService } from './wheel-report.service';
import { LoggerService } from '../../services/logger/logger.service';
import { WheelService } from '../wheel/wheel.service';
import { FileUploadModule } from 'src/services/file-upload/file-upload.module';
import { LanguageModule } from 'src/config/lang/language.module';

@Module({
    imports: [PrismaModule, FileUploadModule, LanguageModule],
    controllers: [WheelReportController],
    providers: [WheelReportService, LoggerService, WheelService],
})
export class WheelReportModule {}
