import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DrawReportService } from './draw-report.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Draw Report API')
@Controller('draw-reports')
export class DrawReportController {
    constructor(private readonly drawReportService: DrawReportService) {}

    @Get(':drawId')
    async getDrawReports(@Param('drawId') drawId: string) {
        return await this.drawReportService.getDrawReports(drawId);
    }

    @Get(':slug/:prizeId')
    async getDrawReportsByPrizeId(@Param('slug') slug: string, @Param('prizeId') prizeId: string) {
        return await this.drawReportService.getDrawReportsByPrizeId(slug, prizeId);
    }
}
