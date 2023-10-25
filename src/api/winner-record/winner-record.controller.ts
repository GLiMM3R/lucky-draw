import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WinnerRecordService } from './winner-record.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Winner Record API')
@Controller('winner-record')
export class WinnerRecordController {
    constructor(private readonly winnerRecordService: WinnerRecordService) {}

    @Get(':campaignId')
    async getWinnerRecords(@Param('campaignId') campaignId: string) {
        return await this.winnerRecordService.getWinnerRecords(campaignId);
    }

    @Get('report/:slug')
    async reportByCampaign(@Param('slug') slug: string) {
        return await this.winnerRecordService.getWinnerReport(slug);
    }

    @Get(':slug/:prizeId')
    async getWinnerRecordBySlug(@Param('slug') slug: string, @Param('prizeId') prizeId: string) {
        return await this.winnerRecordService.getWinnerRecord(slug, prizeId);
    }

    // @Get(':campaignId/:prizeId')
    // async getWinnerRecord(@Param('campaignId') campaignId: string, @Param('prizeId') prizeId: string) {
    //     return await this.winnerRecordService.getWinnerRecord(campaignId, prizeId);
    // }
}
