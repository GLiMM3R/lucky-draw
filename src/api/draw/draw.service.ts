import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { LanguageService } from '../../config/lang/language.service';
import { PrismaService } from '../../config/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { CsvParser } from 'nest-csv-parser';
import { CsvEntity } from './dto/csv-entity.dto';
import { stringToSlug } from '../../util/stringToSlug';
import { FileUploadService } from '../../services/file-upload/file-upload.service';
import { Request } from 'express';
import { ResponseDraw } from './dto/response-draw.dto';
import { CreateDraw, CreateDrawUploadFiles } from './dto/create-draw.dto';
import { UpdateDraw, UpdateDrawUploadFiles } from './dto/update-draw.dto';
import { RequestDraw } from './dto/request-draw.dto';
import { DuplicateDraw } from './dto/duplicate-draw.dto';
import { LoggerService } from '../../services/logger/logger.service';

@Injectable()
export class DrawService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly languageService: LanguageService,
        private readonly csvParser: CsvParser,
        private readonly fileUploadService: FileUploadService,
        private readonly logger: LoggerService,
    ) {}

    async getDraws(request: Request): Promise<ResponseDraw[]> {
        const draws = await this.prisma.draw.findMany({
            include: {
                createdBy: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is fetching all draw`);

        return draws.map((item) => new ResponseDraw(item, item.createdBy));
    }

    async getDrawById(id: string, request: Request): Promise<ResponseDraw> {
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

        this.logger.log(`User ${request['user'].sub.id} is fetching draw with ID ${findDraw.id}`);

        return new ResponseDraw(findDraw, findDraw.createdBy);
    }

    async getDrawBySlug(slug: string, request: Request): Promise<ResponseDraw> {
        const findDraw = await this.prisma.draw.findUnique({
            where: { slug },
            include: {
                createdBy: true,
            },
        });

        if (!findDraw) {
            throw new NotFoundException();
        }

        this.logger.log(`User ${request['user'].sub.id} is fetching draw with slug ${findDraw.id}`);

        return new ResponseDraw(findDraw, findDraw.createdBy);
    }

    async createDraw(drawData: CreateDraw, request: Request, files?: CreateDrawUploadFiles): Promise<string> {
        const slug = stringToSlug(drawData.title);

        let backgroundImage = '';
        let loadingImage = '';

        const newDraw = await this.prisma.draw.create({
            data: {
                ...drawData,
                slug,
                backgroundImage,
                loadingImage,
                userId: request['user'].sub.id,
            },
        });

        if (files.backgroundImage) {
            backgroundImage = await this.fileUploadService.uploadFile(files.backgroundImage[0], `draw/${newDraw.id}/background`);
        }

        if (files.loadingImage) {
            loadingImage = await this.fileUploadService.uploadFile(files.loadingImage[0], `draw/${newDraw.id}/loading`);
        }

        await this.prisma.draw.update({
            where: {
                id: newDraw.id,
            },
            data: {
                backgroundImage,
                loadingImage,
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is creating draw with ID ${newDraw.id}`);

        return 'Create success';
    }

    async updateDraw(id: string, drawData: UpdateDraw, request: Request, files?: UpdateDrawUploadFiles): Promise<string> {
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

            backgroundImage = await this.fileUploadService.uploadFile(files.backgroundImage[0], `draw/${findDraw.id}/background`);
        }

        if (files.loadingImage) {
            if (findDraw.loadingImage.trim()) {
                const fileExists = await this.fileUploadService.fileExists(findDraw.loadingImage);

                if (fileExists) {
                    await this.fileUploadService.deleteFile(findDraw.loadingImage);
                }
            }

            loadingImage = await this.fileUploadService.uploadFile(files.loadingImage[0], `draw/${findDraw.id}/loading`);
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

        this.logger.log(`User ${request['user'].sub.id} is updating draw with ID ${findDraw.id}`);

        return 'Update draw success!';
    }

    async removeBackgroundImage(id: string, request: Request): Promise<string> {
        const findDraw = await this.prisma.draw.findUnique({ where: { id } });

        if (!findDraw) {
            throw new NotFoundException();
        }

        if (findDraw.backgroundImage && findDraw.backgroundImage !== '') {
            await this.fileUploadService.deleteFile(findDraw.backgroundImage);
        }

        await this.prisma.draw.update({
            where: { id },
            data: {
                backgroundImage: '',
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is removing draw loading image with ID ${findDraw.id}`);

        return 'Update success!';
    }

    async removeLoadingImage(id: string, request: Request): Promise<string> {
        const findDraw = await this.prisma.draw.findUnique({ where: { id } });

        if (!findDraw) {
            throw new NotFoundException();
        }

        if (findDraw.loadingImage && findDraw.loadingImage !== '') {
            await this.fileUploadService.deleteFile(findDraw.loadingImage);
        }

        await this.prisma.draw.update({
            where: { id },
            data: {
                loadingImage: '',
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is removing draw loading image with ID ${findDraw.id}`);

        return 'Update success!';
    }

    async updateDataset(id: string, request: Request, file?: Express.Multer.File): Promise<string> {
        const findDraw = await this.prisma.draw.findUnique({ where: { id } });

        if (!findDraw) {
            throw new NotFoundException();
        }

        let dataset = '';

        if (findDraw.dataset && findDraw.dataset !== '') {
            await this.fileUploadService.deleteFile(findDraw.dataset);
        }

        if (file) {
            dataset = await this.fileUploadService.uploadFile(file, `draw/${findDraw.id}/dataset`, false);
        }

        await this.prisma.draw.update({
            where: { id },
            data: {
                dataset,
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is updating dataset draw with ID ${findDraw.id}`);

        return 'Update success!';
    }

    async deleteDraw(id: string, request: Request): Promise<string> {
        const findDraw = await this.prisma.draw.findUnique({ where: { id } });

        if (!findDraw) {
            throw new NotFoundException();
        }

        const fileExists = await this.fileUploadService.fileExists(`draw/${findDraw.id}`);

        if (fileExists) {
            console.log('true');

            await this.fileUploadService.deleteDirectory(`draw/${findDraw.id}`);
        }

        await this.prisma.draw.delete({
            where: { id: findDraw.id },
        });

        this.logger.log(`User ${request['user'].sub.id} is deleting draw with ID ${findDraw.id}`);

        return 'Delete success!';
    }

    async drawing(randomData: RequestDraw, request: Request): Promise<string> {
        const [findDraw, findPrize] = await Promise.all([
            this.prisma.draw.findUnique({ where: { slug: randomData.slug } }),
            this.prisma.drawPrize.findUnique({ where: { id: randomData.prizeId }, include: { _count: { select: { winners: true } } } }),
        ]);

        if (!findDraw || !findPrize) {
            throw new BadRequestException();
        }

        if (findPrize.amount > findPrize._count.winners) {
            const randomAvailableUnit = findPrize.amount - findPrize._count.winners;
            const filePath = path.join(process.env.UPLOAD_FILE_PATH, findDraw.dataset);

            if (!fs.existsSync(filePath)) {
                throw new BadRequestException('No file');
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

            const randomIndices = new Set();
            const maxIterations = 10000; // Define your maximum number of iterations
            let iterations = 0;

            while (randomIndices.size < randomAvailableUnit && iterations < maxIterations) {
                const randomIndex = Math.floor(Math.random() * shuffledArray.length);
                const phoneNumber = shuffledArray[randomIndex].phoneNumber;

                const winnerCount = await this.prisma.drawReport.findMany({ where: { phone: phoneNumber } });

                if (
                    !randomIndices.has(randomIndex) &&
                    !winnerCount.some((obj) => obj.phone === phoneNumber && obj.prizeId === findPrize.id && obj.drawId === findDraw.id) &&
                    winnerCount.length < findDraw.prizeCap
                ) {
                    randomIndices.add(randomIndex);
                    await this.prisma.drawReport.create({
                        data: {
                            drawId: findDraw.id,
                            prizeId: findPrize.id,
                            name: shuffledArray[randomIndex].name,
                            customerId: shuffledArray[randomIndex].customerId,
                            phone: shuffledArray[randomIndex].phoneNumber,
                            userId: request['user'].sub.id,
                        },
                    });
                }
                iterations++;
            }

            if (randomIndices.size !== findPrize.amount) {
                throw new ConflictException('Random not sucess');
            }
            // function getRandomObjects(array: any[], numObjects: number) {
            //     const randomIndices = new Set();
            //     const randomObjects = [];

            //     while (randomIndices.size < numObjects) {
            //         const randomIndex = Math.floor(Math.random() * array.length);
            //         const phoneNumber = array[randomIndex].phoneNumber;

            //         if (!randomIndices.has(randomIndex) && !randomObjects.some((obj) => obj.phoneNumber === phoneNumber)) {
            //             randomIndices.add(randomIndex);
            //             randomObjects.push(array[randomIndex]);
            //         }
            //     }

            //     return randomObjects;
            // }

            // const results = getRandomObjects(shuffledArray, findPrize.amount);

            // results.forEach(async (item) => {
            //     await this.prisma.drawReport.create({
            //         data: {
            //             drawId: findDraw.id,
            //             prizeId: findPrize.id,
            //             name: item.name,
            //             customerId: item.customerId,
            //             phone: item.phoneNumber,
            //             userId: request['user'].sub.id,
            //         },
            //     });
            // });

            await this.prisma.drawPrize.update({ where: { id: findPrize.id }, data: { isComplete: true } });

            this.logger.log(`User ${request['user'].sub.id} is radnom draw with  DrawId ${findDraw.id} and PrizeId ${findPrize.id}`);

            return 'Draw success!';
        } else {
            throw new BadRequestException('This prize already have winner!');
        }
    }

    async duplicateCampaign(id: string, drawData: DuplicateDraw, request: Request): Promise<string> {
        const [findDraw, findExist] = await Promise.all([
            this.prisma.draw.findUnique({ where: { id } }),
            this.prisma.draw.findFirst({ where: { title: drawData.title, slug: stringToSlug(drawData.title) } }),
        ]);

        if (!findDraw) {
            throw new BadRequestException();
        }

        if (findExist) {
            throw new BadRequestException('Already exits');
        }

        let dataset = '';
        let backgroundImage = '';
        let loadingImage = '';

        const newDraw = await this.prisma.draw.create({
            data: {
                slug: stringToSlug(drawData.title),
                title: drawData.title,
                prizeCap: findDraw.prizeCap,
                dataset: findDraw.dataset,
                backgroundImage: findDraw.backgroundImage,
                loadingImage: findDraw.loadingImage,
                device: findDraw.device,
                userId: request['user'].sub.id,
            },
        });

        if (findDraw.dataset) {
            dataset = `draw/${newDraw.id}/dataset/${path.basename(findDraw.dataset)}`;
            const folder = `draw/${newDraw.id}/dataset/`;

            await this.fileUploadService.copyFile(findDraw.dataset, folder, path.basename(findDraw.dataset));
        }

        if (findDraw.backgroundImage) {
            backgroundImage = `draw/${newDraw.id}/backgroundImage/${path.basename(findDraw.backgroundImage)}`;
            const folder = `draw/${newDraw.id}/backgroundImage/`;

            await this.fileUploadService.copyFile(findDraw.backgroundImage, folder, path.basename(findDraw.backgroundImage));
        }

        if (findDraw.loadingImage) {
            loadingImage = `draw/${newDraw.id}/loading/${path.basename(findDraw.loadingImage)}`;
            const folder = `draw/${newDraw.id}/loading/`;

            await this.fileUploadService.copyFile(findDraw.loadingImage, folder, path.basename(findDraw.loadingImage));
        }

        await this.prisma.draw.update({
            where: {
                id: newDraw.id,
            },
            data: {
                dataset: dataset,
                backgroundImage: backgroundImage,
                loadingImage: loadingImage,
            },
        });

        const findPrizes = await this.prisma.drawPrize.findMany({ where: { drawId: findDraw.id } });

        await Promise.all(
            findPrizes.map(async (item) => {
                let image = '';

                if (item.image) {
                    image = `draw/${newDraw.id}/prizes/${path.basename(item.image)}`;
                    const folder = `draw/${newDraw.id}/prizes/`;

                    await this.fileUploadService.copyFile(item.image, folder, path.basename(item.image));
                }

                await this.prisma.drawPrize.create({
                    data: {
                        drawId: newDraw.id,
                        rank: item.rank,
                        title: item.title,
                        amount: item.amount,
                        image: image,
                        userId: request['user'].sub.id,
                    },
                });
            }),
        );

        this.logger.log(`User ${request['user'].sub.id} is duplicating with ID ${findDraw.id}`);

        return 'Duplicate success!';
    }
}
