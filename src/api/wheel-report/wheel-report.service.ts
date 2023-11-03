import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ResponseWheelReport } from './dto/response-wheel-report.dto';

@Injectable()
export class WheelReportService {
    constructor(private readonly prisma: PrismaService) {}

    async getWheelReports(wheelId: string): Promise<ResponseWheelReport[]> {
        if (!wheelId) {
            throw new BadRequestException();
        }

        const winners = await this.prisma.wheelReport.findMany({ where: { wheelId }, include: { wheel: true, prize: true, createdBy: true } });

        return winners.map((item) => new ResponseWheelReport(item, item.wheel, item.prize, item.createdBy));
    }

    async getWheelReportByPrizeId(slug: string, prizeId: string): Promise<ResponseWheelReport[]> {
        const findWheel = await this.prisma.wheel.findUnique({ where: { slug } });

        if (!findWheel) {
            throw new NotFoundException();
        }

        const findWinner = await this.prisma.wheelReport.findMany({
            where: { wheelId: findWheel.id, prizeId: prizeId },
            include: { wheel: true, prize: true, createdBy: true },
        });

        if (!findWinner) {
            throw new NotFoundException();
        }

        return findWinner.map((item) => new ResponseWheelReport(item, item.wheel, item.prize, item.createdBy));
    }
}
