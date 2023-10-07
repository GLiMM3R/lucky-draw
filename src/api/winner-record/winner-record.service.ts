import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class WinnerRecordService {
    constructor(private readonly prisma: PrismaService) {}

    async getWinnerRecords(campaignId: string) {
        const findWinnerRecord = await this.prisma.winnerRecord.findMany({ where: { campaignId: campaignId } });

        if (!findWinnerRecord) {
            throw new NotFoundException();
        }

        return findWinnerRecord;
    }

    async getWinnerRecord(campaignId: string, prizeId: string) {
        const findWinnerRecord = await this.prisma.winnerRecord.findMany({ where: { campaignId: campaignId, prizeId: prizeId } });

        if (!findWinnerRecord) {
            throw new NotFoundException();
        }

        return findWinnerRecord;
    }
}
