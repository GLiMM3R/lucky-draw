import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { LanguageService } from 'src/config/lang/language.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { CsvParser } from 'nest-csv-parser';
import { CsvEntity } from './dto/csv-entity.dto';
import { stringToSlug } from 'src/util/stringToSlug';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import * as ExcelJS from 'exceljs';
import * as tmp from 'tmp';
import { Request } from 'express';
import { ResponseDraw } from './dto/response-draw.dto';
import { CreateDraw, CreateDrawUploadFiles } from './dto/create-draw.dto';
import { UpdateDraw, UpdateDrawUploadFiles } from './dto/update-draw.dto';
import { RequestDraw } from './dto/request-draw.dto';

@Injectable()
export class DrawService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly languageService: LanguageService,
        private readonly csvParser: CsvParser,
        private readonly fileUploadService: FileUploadService,
    ) {}

    async getDraws(): Promise<ResponseDraw[]> {
        const draws = await this.prisma.draw.findMany({
            include: {
                createdBy: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return draws.map((item) => new ResponseDraw(item, item.createdBy));
    }

    async getDrawById(id: string): Promise<ResponseDraw> {
        if (!id) {
            throw new BadRequestException();
        }

        const findDraw = await this.prisma.draw.findUnique({
            where: { id },
            include: {
                createdBy: true,
            },
        });

        if (!findDraw) {
            throw new NotFoundException();
        }

        return new ResponseDraw(findDraw, findDraw.createdBy);
    }

    async getDrawBySlug(slug: string): Promise<ResponseDraw> {
        const findDraw = await this.prisma.draw.findUnique({
            where: { slug },
            include: {
                createdBy: true,
            },
        });

        if (!findDraw) {
            throw new NotFoundException();
        }

        return new ResponseDraw(findDraw, findDraw.createdBy);
    }

    async createDraw(drawData: CreateDraw, request: Request, files?: CreateDrawUploadFiles): Promise<string> {
        const slug = stringToSlug(drawData.title);

        let backgroundImage = '';
        let loadingImage = '';

        if (files.backgroundImage) {
            backgroundImage = await this.fileUploadService.uploadFile(files.backgroundImage[0], `draw/${slug}/background`);
        }

        if (files.loadingImage) {
            loadingImage = await this.fileUploadService.uploadFile(files.loadingImage[0], `draw/${slug}/loading`);
        }

        await this.prisma.draw.create({
            data: {
                ...drawData,
                slug: stringToSlug(drawData.title),
                backgroundImage,
                loadingImage,
                userId: request['user'].sub.id,
            },
        });

        return 'Create success';
    }

    async updateDraw(id: string, drawData: UpdateDraw, files?: UpdateDrawUploadFiles): Promise<string> {
        const findDraw = await this.prisma.draw.findUnique({ where: { id } });
        if (!findDraw) {
            throw new NotFoundException();
        }

        let backgroundImage = findDraw.backgroundImage;
        let loadingImage = findDraw.loadingImage;

        if (files.backgroundImage) {
            if (findDraw.backgroundImage.trim()) {
                const fileExists = await this.fileUploadService.fileExists(findDraw.backgroundImage);

                if (fileExists) {
                    await this.fileUploadService.deleteFile(findDraw.backgroundImage);
                }
            }

            backgroundImage = await this.fileUploadService.uploadFile(files.backgroundImage[0], `draw/${findDraw.slug}/background`);
        }

        if (files.loadingImage) {
            if (findDraw.loadingImage.trim()) {
                const fileExists = await this.fileUploadService.fileExists(findDraw.loadingImage);

                if (fileExists) {
                    await this.fileUploadService.deleteFile(findDraw.loadingImage);
                }
            }

            loadingImage = await this.fileUploadService.uploadFile(files.loadingImage[0], `draw/${findDraw.slug}/loading`);
        }

        await this.prisma.draw.update({
            where: { id },
            data: {
                ...drawData,
                slug: stringToSlug(drawData.title),
                backgroundImage,
                loadingImage,
                isComplete: Boolean(drawData.isComplete),
            },
        });

        return 'Update draw success!';
    }

    async updateDataset(id: string, file?: Express.Multer.File): Promise<string> {
        const findDraw = await this.prisma.draw.findUnique({ where: { id } });

        if (!findDraw) {
            throw new NotFoundException();
        }

        let dataset = '';

        if (file) {
            if (findDraw.dataset && findDraw.dataset !== '') {
                await this.fileUploadService.deleteFile(findDraw.dataset);
            }

            dataset = await this.fileUploadService.uploadFile(file, `draw/${findDraw.slug}/dataset`, false);
        }

        await this.prisma.draw.update({
            where: { id },
            data: {
                dataset,
            },
        });

        return 'Update success!';
    }

    async deleteDraw(id: string): Promise<string> {
        const findDraw = await this.prisma.draw.findUnique({ where: { id } });

        if (!findDraw) {
            throw new NotFoundException();
        }

        if (findDraw.dataset.trim()) {
            const fileExists = await this.fileUploadService.fileExists(findDraw.dataset);

            if (fileExists) {
                await this.fileUploadService.deleteFile(findDraw.dataset);
            }
        }

        if (findDraw.backgroundImage.trim()) {
            const fileExists = await this.fileUploadService.fileExists(findDraw.backgroundImage);

            if (fileExists) {
                await this.fileUploadService.deleteFile(findDraw.backgroundImage);
            }
        }

        await this.prisma.draw.delete({
            where: { id: findDraw.id },
        });

        return 'Delete success!';
    }

    async drawing(randomData: RequestDraw, request: Request) {
        const [findDraw, findPrize] = await Promise.all([
            this.prisma.draw.findUnique({ where: { slug: randomData.slug } }),
            this.prisma.drawPrize.findUnique({ where: { id: randomData.prizeId } }),
        ]);

        if (!findDraw || !findPrize) {
            throw new BadRequestException();
        }

        const countWinnerRecord = await this.prisma.drawReport.count({
            where: {
                drawId: findDraw.id,
                prizeId: findPrize.id,
            },
        });

        if (findPrize.amount > countWinnerRecord) {
            const filePath = path.join(process.env.UPLOAD_FILE_PATH, findDraw.dataset);

            if (!fs.existsSync(filePath)) {
                throw new BadRequestException();
            }

            const stream = fs.createReadStream(filePath);
            const dataset = await this.csvParser.parse(stream, CsvEntity, null, null, {
                strict: true,
                separator: ',',
            });

            if (dataset.list.length < findPrize.amount) {
                throw new BadRequestException('Dataset is less than prize amount');
            }

            let index = 1;
            const generatedObjects = dataset.list.flatMap((item) =>
                Array.from({ length: Number(item.Coupon) }, () => ({
                    index: index++,
                    name: item.Name,
                    customerId: item.CustomerID,
                    phoneNumber: item.PhoneNumber,
                    coupon: Number(item.Coupon),
                })),
            );

            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            const shuffledArray = shuffleArray(generatedObjects);

            function getRandomObjects(array, numObjects) {
                const randomIndices = new Set();
                const randomObjects = [];

                while (randomIndices.size < numObjects) {
                    const randomIndex = Math.floor(Math.random() * array.length);
                    const phoneNumber = array[randomIndex].phoneNumber;

                    if (!randomIndices.has(randomIndex) && !randomObjects.some((obj) => obj.phoneNumber === phoneNumber)) {
                        randomIndices.add(randomIndex);
                        randomObjects.push(array[randomIndex]);
                    }
                }

                return randomObjects;
            }

            const results = getRandomObjects(shuffledArray, findPrize.amount);

            results.forEach(async (item) => {
                const findWinner = await this.prisma.drawReport.findFirst({
                    where: {
                        drawId: findDraw.id,
                        prizeId: findPrize.id,
                        phone: item.phoneNumber,
                    },
                });

                if (!findWinner) {
                    await this.prisma.drawReport.create({
                        data: {
                            drawId: findDraw.id,
                            prizeId: findPrize.id,
                            name: item.name,
                            customerId: item.customerId,
                            phone: item.phoneNumber,
                            userId: request['user'].sub.id,
                        },
                    });
                }
            });

            await this.prisma.drawPrize.update({ where: { id: findPrize.id }, data: { isComplete: true } });

            return await this.prisma.drawReport.findMany({
                where: {
                    drawId: findDraw.id,
                    prizeId: findPrize.id,
                },
            });
        } else {
            throw new BadRequestException('This prize already have winner!');
        }
    }

    async downloadDrawReport(id: string) {
        try {
            const findDraw = await this.prisma.draw.findUnique({ where: { id }, include: { prizes: { include: { winners: true } } } });

            if (!findDraw) {
                throw new NotFoundException();
            }

            const workbook = new ExcelJS.Workbook();

            const worksheet = workbook.addWorksheet('Sheet 1');

            let reports;
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

            return file;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
