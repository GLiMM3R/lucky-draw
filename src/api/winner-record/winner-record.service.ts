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

    // async getWinnerRecord(campaignId: string, prizeId: string) {
    //     const findWinnerRecord = await this.prisma.winnerRecord.findMany({ where: { campaignId: campaignId, prizeId: prizeId } });

    //     if (!findWinnerRecord) {
    //         throw new NotFoundException();
    //     }

    //     return findWinnerRecord;
    // }

    async getWinnerRecord(slug: string, prizeId: string) {
        const findCampaign = await this.prisma.campaign.findUnique({ where: { slug } });

        if (!findCampaign) {
            throw new NotFoundException();
        }
        const findWinnerRecord = await this.prisma.winnerRecord.findMany({ where: { campaignId: findCampaign.id, prizeId: prizeId } });

        if (!findWinnerRecord) {
            throw new NotFoundException();
        }

        return findWinnerRecord;
    }

    async getWinnerReport(slug: string) {
        const findCampaign = await this.prisma.campaign.findUnique({ where: { slug } });

        if (!findCampaign) {
            throw new NotFoundException();
        }

        const findRecord = await this.prisma.winnerRecord.findMany({
            where: {
                campaignId: findCampaign.id,
            },
            include: {
                prize: true,
            },
        });

        if (!findRecord) {
            throw new NotFoundException();
        }

        return findRecord;
    }
}
