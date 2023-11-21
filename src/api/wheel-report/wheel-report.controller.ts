import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { WheelReportService } from './wheel-report.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guard/auth.guard';
import { CreateWheelReport } from './dto/create-wheel-report.dto';
import { Request, Response } from 'express';
import { WheelService } from '../wheel/wheel.service';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Winner API')
@Controller('wheel-reports')
export class WheelReportController {
    constructor(
        private readonly wheelReportService: WheelReportService,
        private readonly wheelService: WheelService,
    ) {}

    @Get('download/id=:wheelId')
    async downloadWheelReportByWheelId(@Param('wheelId') wheelId: string, @Res() res: Response, @Req() request: Request) {
        const result = await this.wheelReportService.downloadWheelReport(wheelId, request);
        res.download(`${result}`);
    }

    @Get('download/slug=:slug')
    async downloadWheelReportBySlug(@Param('slug') slug: string, @Res() res: Response, @Req() request: Request) {
        const findWheel = await this.wheelService.getWheelBySlug(slug, request);
        const result = await this.wheelReportService.downloadWheelReport(findWheel.id, request);
        res.download(`${result}`);
    }

    @Get(':wheelId')
    async getWheelReports(@Param('wheelId') wheelId: string, @Req() request: Request) {
        return await this.wheelReportService.getWheelReports(wheelId, request);
    }

    @Get(':slug/:prizeId')
    async getWheelReportByPrizeId(@Param('slug') slug: string, @Param('prizeId') prizeId: string, @Req() request: Request) {
        return await this.wheelReportService.getWheelReportByPrizeId(slug, prizeId, request);
    }

    @Post()
    async createWheelReport(@Body() wheelReportData: CreateWheelReport, @Req() request: Request) {
        return await this.wheelReportService.createWheelReport(wheelReportData, request);
    }
}
