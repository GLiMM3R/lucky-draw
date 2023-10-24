import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { LanguageService } from 'src/config/lang/language.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { RequestRandomDto } from './dto/request-random.dto';
import { CsvParser } from 'nest-csv-parser';
import { CsvEntity } from './dto/csv-entity.dto';
import { RequestWheelDto } from './dto/request-wheel.dto';

@Injectable()
export class RandomService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly languageService: LanguageService,
        private readonly csvParser: CsvParser,
    ) {}

    async randomDraw(randomData: RequestRandomDto) {
        const [findCampaign, findPrize] = await Promise.all([
            this.prisma.campaign.findUnique({ where: { slug: randomData.campaignSlug } }),
            this.prisma.prize.findUnique({ where: { id: randomData.prizeId } }),
        ]);

        if (!findCampaign || !findPrize) {
            throw new BadRequestException();
        }

        const countWinnerRecord = await this.prisma.winnerRecord.count({
            where: {
                campaignId: findCampaign.id,
                prizeId: findPrize.id,
            },
        });

        if (findPrize.amount > countWinnerRecord) {
            const filePath = path.join(process.env.UPLOAD_FILE_PATH, findCampaign.file);

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
                const findWinner = await this.prisma.winnerRecord.findFirst({
                    where: {
                        campaignId: findCampaign.id,
                        prizeId: findPrize.id,
                        winnerPhone: item.phoneNumber,
                    },
                });

                if (!findWinner) {
                    await this.prisma.winnerRecord.create({
                        data: {
                            campaignId: findCampaign.id,
                            prizeId: findPrize.id,
                            winnerName: item.name,
                            winnerPhone: item.phoneNumber,
                        },
                    });
                }
            });

            await this.prisma.prize.update({ where: { id: findPrize.id }, data: { isDone: true } });

            return await this.prisma.winnerRecord.findMany({
                where: {
                    campaignId: findCampaign.id,
                    prizeId: findPrize.id,
                },
            });
        } else {
            throw new BadRequestException('This prize already have winner!');
        }
    }

    async wheelDraw(randomData: RequestWheelDto) {
        const [findCampaign, findPrize] = await Promise.all([
            this.prisma.campaign.findUnique({ where: { id: randomData.campaignId } }),
            this.prisma.prize.findUnique({ where: { id: randomData.prizeId } }),
        ]);

        if (!findCampaign || !findPrize) {
            throw new BadRequestException();
        }
        const winnerRecord = await this.prisma.winnerRecord.create({
            data: {
                campaignId: randomData.campaignId,
                prizeId: randomData.prizeId,
                winnerName: randomData.winnerName,
                winnerPhone: randomData.winnerPhone,
            },
        });

        if (!winnerRecord) {
            throw new InternalServerErrorException();
        }
        await this.prisma.coupon.update({ where: { id: randomData.couponId }, data: { isNew: false } });

        const prize = await this.prisma.prize.findUnique({
            where: { id: randomData.prizeId },
            select: {
                _count: {
                    select: {
                        winnerRecord: true,
                    },
                },
            },
        });

        if (findPrize.amount === prize._count.winnerRecord) {
            await this.prisma.prize.update({ where: { id: randomData.prizeId }, data: { isDone: true } });
        }

        return winnerRecord;
    }
}
