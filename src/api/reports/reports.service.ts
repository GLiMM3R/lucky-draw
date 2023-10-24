import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import * as tmp from 'tmp';

@Injectable()
export class ReportsService {
    constructor(private readonly prisma: PrismaService) {}

    async downloadReport(id: string) {
        try {
            const findCampaign = await this.prisma.campaign.findUnique({ where: { id }, include: { prizes: { include: { winnerRecord: true } } } });

            if (!findCampaign) {
                throw new NotFoundException();
            }

            const workbook = new ExcelJS.Workbook();

            const worksheet = workbook.addWorksheet('Sheet 1');

            let reports = [];
            findCampaign.prizes.forEach((prize) => {
                if (prize) {
                    prize.winnerRecord.forEach((item) => {
                        const data = {
                            campaign: findCampaign.title,
                            prize: prize.title,
                            winnerName: item.winnerName,
                            winnerPhone: item.winnerPhone,
                            createdAt: item.createdAt,
                            updatedAt: item.updatedAt,
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
                    header: 'WinnerPhone',
                    key: 'winnerPhone',
                },
                {
                    header: 'CreatedAt',
                    key: 'createdAt',
                },
                {
                    header: 'UpdatedAt',
                    key: 'updatedAt',
                },
            ];

            worksheet.addRows(reports);

            const file = await new Promise((resolve) => {
                tmp.file({ discarDescriptor: true, prefix: findCampaign.title, postfix: '.xlsx', mode: parseInt('0600', 8) }, async (err, file) => {
                    if (err) {
                        throw new BadRequestException(err);
                    }

                    workbook.xlsx
                        .writeFile(file)
                        .then((_) => {
                            resolve(file);
                        })
                        .catch((err) => {
                            throw new BadRequestException(err);
                        });
                });
            });

            return file;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
