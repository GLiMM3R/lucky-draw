import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { ResponseWheelReport } from './dto/response-wheel-report.dto';
import { CreateWheelReport } from './dto/create-wheel-report.dto';
import { Request } from 'express';
import * as ExcelJS from 'exceljs';
import * as tmp from 'tmp';
import { LoggerService } from '../../services/logger/logger.service';

@Injectable()
export class WheelReportService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService,
    ) {}

    async getWheelReports(wheelId: string, request: Request): Promise<ResponseWheelReport[]> {
        if (!wheelId) {
            throw new BadRequestException();
        }

        const winners = await this.prisma.wheelReport.findMany({ where: { wheelId }, include: { wheel: true, prize: true, createdBy: true } });

        this.logger.log(`User ${request['user'].sub.id} is fetching WheelReport with WheelID ${wheelId}.`);

        return winners.map((item) => new ResponseWheelReport(item, item.wheel, item.prize, item.createdBy));
    }

    async getWheelReportByPrizeId(slug: string, prizeId: string, request: Request): Promise<ResponseWheelReport[]> {
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

        this.logger.log(`User ${request['user'].sub.id} is fetching WheelReport with Slug ${slug} and PrizeID ${prizeId}.`);

        return findWinner.map((item) => new ResponseWheelReport(item, item.wheel, item.prize, item.createdBy));
    }

    async createWheelReport(wheelReportData: CreateWheelReport, request: Request): Promise<string> {
        const [findWheel, findPrize] = await Promise.all([
            this.prisma.wheel.findUnique({ where: { id: wheelReportData.wheelId } }),
            this.prisma.wheelPrize.findUnique({ where: { id: wheelReportData.prizeId } }),
        ]);

        if (!findWheel && !findPrize) {
            throw new NotFoundException();
        }

        await this.prisma.wheelReport.create({
            data: {
                ...wheelReportData,
                userId: request['user'].sub.id,
            },
        });

        const countReport = await this.prisma.wheelReport.count({
            where: { wheelId: wheelReportData.wheelId, prizeId: wheelReportData.prizeId },
        });

        if (findPrize.amount === countReport) {
            await this.prisma.wheelPrize.update({
                where: { id: wheelReportData.prizeId, wheelId: wheelReportData.wheelId },
                data: { isComplete: true },
            });
        }

        this.logger.log(
            `User ${request['user'].sub.id} is creating WheelReport with WheelID ${wheelReportData.wheelId} and PrizeID ${wheelReportData.prizeId}.`,
        );

        return 'Create Success!';
    }

    async downloadWheelReport(wheelId: string, request: Request) {
        try {
            const findReport = await this.prisma.wheelReport.findMany({
                where: { wheelId: wheelId },
                include: { prize: true, wheel: true, createdBy: true },
                orderBy: {
                    createdAt: 'asc',
                },
            });

            if (!findReport) {
                throw new NotFoundException();
            }

            const workbook = new ExcelJS.Workbook();

            const worksheet = workbook.addWorksheet('Sheet 1');

            let reports = [];
            findReport.forEach((item, index) => {
                if (item) {
                    const data = {
                        no: index + 1,
                        campaign: item.wheel.title,
                        prize: item.prize.title,
                        createdBy: item.createdBy.username,
                        createdAt: item.createdAt,
                    };
                    reports.push(data);
                }
            });

            worksheet.columns = [
                {
                    header: 'NO',
                    key: 'no',
                },
                {
                    header: 'Campaign',
                    key: 'campaign',
                },
                {
                    header: 'Prize',
                    key: 'prize',
                },
                {
                    header: 'CreatedBy',
                    key: 'createdBy',
                },
                {
                    header: 'CreatedAt',
                    key: 'createdAt',
                },
            ];

            worksheet.addRows(reports);

            const file = await new Promise((resolve) => {
                tmp.file(
                    { discarDescriptor: true, prefix: findReport[0].wheel.title, postfix: '.xlsx', mode: parseInt('0600', 8) },
                    async (err, file) => {
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
                    },
                );
            });

            this.logger.log(`User ${request['user'].sub.id} is downloading WheelReport with WheelID ${wheelId}.`);

            return file;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
