import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { ResponseDrawReport, ResponseDrawReportWithIncludes } from './dto/response-draw-report.dto';
import * as ExcelJS from 'exceljs';
import * as tmp from 'tmp';
import { Request } from 'express';
import { LoggerService } from '../../services/logger/logger.service';
@Injectable()
export class DrawReportService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService,
    ) {}

    async getDrawReports(drawId: string, request: Request): Promise<ResponseDrawReportWithIncludes[]> {
        if (!drawId) {
            throw new BadRequestException();
        }

        const winners = await this.prisma.drawReport.findMany({ where: { drawId }, include: { draw: true, prize: true, createdBy: true } });

        this.logger.log(`User ${request['user'].sub.id} is fetching DrawReport with DrawID ${drawId}.`);

        return winners.map((item) => new ResponseDrawReportWithIncludes(item, item.draw, item.prize, item.createdBy));
    }

    async getDrawReportsBySlug(slug: string, request: Request): Promise<ResponseDrawReportWithIncludes[]> {
        const findDraw = await this.prisma.draw.findUnique({ where: { slug } });

        if (!findDraw) {
            throw new NotFoundException();
        }

        const winners = await this.prisma.drawReport.findMany({
            where: { drawId: findDraw.id },
            include: { draw: true, prize: true, createdBy: true },
        });

        this.logger.log(`User ${request['user'].sub.id} is fetching DrawReport with Slug ${slug}.`);

        return winners.map((item) => new ResponseDrawReportWithIncludes(item, item.draw, item.prize, item.createdBy));
    }

    async getDrawReportsByPrizeId(slug: string, prizeId: string, request: Request): Promise<ResponseDrawReport[]> {
        const findDraw = await this.prisma.draw.findUnique({ where: { slug } });

        if (!findDraw) {
            throw new NotFoundException();
        }

        const findWinner = await this.prisma.drawReport.findMany({ where: { drawId: findDraw.id, prizeId: prizeId }, include: { createdBy: true } });

        if (!findWinner) {
            throw new NotFoundException();
        }

        this.logger.log(`User ${request['user'].sub.id} is fetching DrawReport with DrawID ${findDraw.id} and PrizeID ${prizeId}.`);

        return findWinner.map((item) => new ResponseDrawReport(item, item.createdBy));
    }

    async downloadDrawReport(id: string, request: Request) {
        try {
            const findDraw = await this.prisma.draw.findUnique({ where: { id }, include: { prizes: { include: { winners: true } } } });

            if (!findDraw) {
                throw new NotFoundException();
            }

            const workbook = new ExcelJS.Workbook();

            const worksheet = workbook.addWorksheet('Sheet 1');

            let reports = [];
            findDraw.prizes.forEach((prize) => {
                if (prize) {
                    prize.winners.forEach((item) => {
                        const data = {
                            campaign: findDraw.title,
                            prize: prize.title,
                            winnerName: item.name,
                            customerId: item.customerId,
                            winnerPhone: item.phone,
                            createdAt: item.createdAt,
                        };
                        reports.push(data);
                    });
                }
            });

            worksheet.columns = [
                {
                    header: 'Campaign',
                    key: 'campaign',
                },
                {
                    header: 'Prize',
                    key: 'prize',
                },
                {
                    header: 'WinnerName',
                    key: 'winnerName',
                },
                {
                    header: 'CustomerId',
                    key: 'customerId',
                },
                {
                    header: 'WinnerPhone',
                    key: 'winnerPhone',
                },
                {
                    header: 'CreatedAt',
                    key: 'createdAt',
                },
            ];

            worksheet.addRows(reports);

            const file = await new Promise((resolve) => {
                tmp.file({ discarDescriptor: true, prefix: findDraw.title, postfix: '.xlsx', mode: parseInt('0600', 8) }, async (err, file) => {
                    if (err) {
                        throw new BadRequestException(err);
                    }

                    workbook.xlsx
                        .writeFile(file)
                        .then(() => {
                            resolve(file);
                        })
                        .catch((err) => {
                            throw new BadRequestException(err);
                        });
                });
            });

            this.logger.log(`User ${request['user'].sub.id} is downloading DrawReport  with DrawID ${findDraw.id}.`);

            return file;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
