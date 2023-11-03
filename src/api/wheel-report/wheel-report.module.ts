import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { WheelReportController } from './wheel-report.controller';
import { WheelReportService } from './wheel-report.service';

@Module({
    imports: [PrismaModule],
    controllers: [WheelReportController],
    providers: [WheelReportService],
})
export class WheelReportModule {}
