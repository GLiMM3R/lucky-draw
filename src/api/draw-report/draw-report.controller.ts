import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { DrawReportService } from './draw-report.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guard/auth.guard';
import { Request, Response } from 'express';
import { DrawService } from '../draw/draw.service';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Draw Report API')
@Controller('draw-reports')
export class DrawReportController {
    constructor(
        private readonly drawReportService: DrawReportService,
        private readonly drawService: DrawService,
    ) {}

    @Get('download/id=:id')
    async downloadDrawReportByDrawId(@Param('id') id: string, @Res() res: Response, @Req() request: Request) {
        const result = await this.drawReportService.downloadDrawReport(id, request);
        res.download(`${result}`);
    }

    @Get('download/slug=:slug')
    async downloadDrawReportBySlug(@Param('slug') slug: string, @Res() res: Response, @Req() request: Request) {
        const findDraw = await this.drawService.getDrawBySlug(slug, request);
        const result = await this.drawReportService.downloadDrawReport(findDraw.id, request);
        res.download(`${result}`);
    }

    @Get('id=:drawId')
    async getDrawReports(@Param('drawId') drawId: string, @Req() request: Request) {
        return await this.drawReportService.getDrawReports(drawId, request);
    }

    @Get('slug=:slug')
    async getDrawReportsBySlug(@Param('slug') slug: string, @Req() request: Request) {
        return await this.drawReportService.getDrawReportsBySlug(slug, request);
    }

    @Get(':slug/:prizeId')
    async getDrawReportsByPrizeId(@Param('slug') slug: string, @Param('prizeId') prizeId: string, @Req() request: Request) {
        return await this.drawReportService.getDrawReportsByPrizeId(slug, prizeId, request);
    }
}
