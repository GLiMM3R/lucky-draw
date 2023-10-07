import { Controller, Get, Param } from '@nestjs/common';
import { WinnerRecordService } from './winner-record.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Winner Record API')
@Controller('winner-record')
export class WinnerRecordController {
    constructor(private readonly winnerRecordService: WinnerRecordService) {}

    @Get(':campaignId')
    async getWinnerRecords(@Param('campaignId') campaignId: string) {
        return await this.winnerRecordService.getWinnerRecords(campaignId);
    }

    @Get(':campaignId/:prizeId')
    async getWinnerRecord(@Param('campaignId') campaignId: string, @Param('prizeId') prizeId: string) {
        return await this.winnerRecordService.getWinnerRecord(campaignId, prizeId);
    }
}
