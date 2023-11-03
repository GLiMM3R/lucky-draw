import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { DrawReportController } from './draw-report.controller';
import { DrawReportService } from './draw-report.service';

@Module({
    imports: [PrismaModule],
    controllers: [DrawReportController],
    providers: [DrawReportService],
})
export class DrawReportModule {}
