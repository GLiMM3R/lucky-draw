import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WheelReportService } from './wheel-report.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Winner API')
@Controller('wheel-reports')
export class WheelReportController {
    constructor(private readonly wheelReportService: WheelReportService) {}

    @Get(':wheelId')
    async getWheelReports(@Param('wheelId') wheelId: string) {
        return await this.wheelReportService.getWheelReports(wheelId);
    }

    @Get(':slug/:prizeId')
    async getWheelReportByPrizeId(@Param('slug') slug: string, @Param('prizeId') prizeId: string) {
        return await this.wheelReportService.getWheelReportByPrizeId(slug, prizeId);
    }
}
