import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma/prisma.module';
import { DrawReportController } from './draw-report.controller';
import { DrawReportService } from './draw-report.service';
import { DrawModule } from '../draw/draw.module';
import { LoggerService } from '../../services/logger/logger.service';

@Module({
    imports: [PrismaModule, DrawModule],
    controllers: [DrawReportController],
    providers: [DrawReportService, LoggerService],
})
export class DrawReportModule {}
