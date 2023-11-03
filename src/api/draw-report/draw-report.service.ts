import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ResponseDrawReport, ResponseDrawReportWithIncludes } from './dto/response-draw-report.dto';

@Injectable()
export class DrawReportService {
    constructor(private readonly prisma: PrismaService) {}

    async getDrawReports(drawId: string): Promise<ResponseDrawReportWithIncludes[]> {
        if (!drawId) {
            throw new BadRequestException();
        }

        const winners = await this.prisma.drawReport.findMany({ where: { drawId }, include: { draw: true, prize: true, createdBy: true } });

        return winners.map((item) => new ResponseDrawReportWithIncludes(item, item.draw, item.prize, item.createdBy));
    }

    async getDrawReportsByPrizeId(slug: string, prizeId: string): Promise<ResponseDrawReport[]> {
        const findDraw = await this.prisma.draw.findUnique({ where: { slug } });

        if (!findDraw) {
            throw new NotFoundException();
        }

        const findWinner = await this.prisma.drawReport.findMany({ where: { drawId: findDraw.id, prizeId: prizeId }, include: { createdBy: true } });

        if (!findWinner) {
            throw new NotFoundException();
        }

        return findWinner.map((item) => new ResponseDrawReport(item, item.createdBy));
    }
}
