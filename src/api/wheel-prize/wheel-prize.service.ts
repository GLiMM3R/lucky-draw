import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LanguageService } from '../../config/lang/language.service';
import { PrismaService } from '../../config/prisma/prisma.service';
import { FileUploadService } from '../../services/file-upload/file-upload.service';
import { UpdateWheelPrize } from './dto/update-wheel-prize.dto';
import { Request } from 'express';
import { ResponseWheelPrize, ResponseWheelPrizeWithWinner } from './dto/response-wheel-prize.dto';
import { CreateWheelPrize } from './dto/create-wheel-prize.dto';
import { LoggerService } from '../../services/logger/logger.service';

@Injectable()
export class WheelPrizeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly languageService: LanguageService,
        private readonly logger: LoggerService,
    ) {}

    async getWheelPrizes(request: Request): Promise<ResponseWheelPrize[]> {
        const findPrizes = await this.prisma.wheelPrize.findMany({
            include: {
                createdBy: true,
                _count: {
                    select: {
                        winners: true,
                    },
                },
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is fetching WheelPrizes.`);

        return findPrizes.map((item) => new ResponseWheelPrize(item, item.createdBy, item._count.winners));
    }

    async getWheelPrizeById(id: string, request: Request): Promise<ResponseWheelPrize> {
        if (!id) {
            throw new BadRequestException();
        }
        const findPrize = await this.prisma.wheelPrize.findUnique({
            where: { id },
            include: {
                createdBy: true,
                _count: {
                    select: {
                        winners: true,
                    },
                },
            },
        });

        if (!findPrize) {
            throw new NotFoundException();
        }

        this.logger.log(`User ${request['user'].sub.id} is fetching WheelPrize with ID ${id}.`);

        return new ResponseWheelPrize(findPrize, findPrize.createdBy, findPrize._count.winners);
    }

    async getWheelPrizeBySlug(slug: string, request: Request): Promise<ResponseWheelPrize[]> {
        if (!slug) {
            throw new BadRequestException();
        }

        const findWheel = await this.prisma.wheel.findUnique({ where: { slug } });

        const findPrizes = await this.prisma.wheelPrize.findMany({
            where: { wheelId: findWheel.id },
            include: {
                createdBy: true,
                _count: {
                    select: {
                        winners: true,
                    },
                },
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is fetching WheelPrizes with Slug ${slug}.`);

        return findPrizes.map((item) => new ResponseWheelPrize(item, item.createdBy, item.amount - item._count.winners));
    }

    async getWinnerWheelPrizesBySlug(slug: string, request: Request): Promise<ResponseWheelPrizeWithWinner[]> {
        if (!slug) {
            throw new BadRequestException();
        }

        const findWheel = await this.prisma.wheel.findUnique({ where: { slug } });

        const findPrize = await this.prisma.wheelPrize.findMany({
            where: { wheelId: findWheel.id },
            include: {
                createdBy: true,
                winners: true,
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is fetching WheelPrizes include winners with Slug ${slug}.`);

        return findPrize.map((item) => new ResponseWheelPrizeWithWinner(item, item.createdBy, item.winners));
    }

    async createWheelPrize(prizeData: CreateWheelPrize, request: Request, imageData?: Express.Multer.File): Promise<string> {
        const findWheel = await this.prisma.wheel.findUnique({ where: { slug: prizeData.slug } });

        if (!findWheel) {
            throw new NotFoundException();
        }

        let image = '';

        if (imageData) {
            image = await this.fileUploadService.uploadFile(imageData, `wheel/${findWheel.slug}/prizes`);
        }

        await this.prisma.wheelPrize.create({
            data: {
                wheelId: findWheel.id,
                title: prizeData.title,
                amount: Number(prizeData.amount) || 0,
                image,
                userId: request['user'].sub.id,
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is creating WheelPrize.`);

        return 'Create prize success!';
    }

    async updateWheelPrize(id: string, prizeData: UpdateWheelPrize, request: Request, imageData?: Express.Multer.File): Promise<string> {
        const findWheel = await this.prisma.wheel.findUnique({ where: { slug: prizeData.slug } });

        if (!findWheel) {
            throw new NotFoundException();
        }

        const findPrize = await this.prisma.wheelPrize.findUnique({ where: { id } });

        if (!findPrize) {
            throw new NotFoundException();
        }

        let image = findPrize.image;

        if (imageData) {
            if (findPrize.image && findPrize.image.trim().length > 0) {
                const fileExists = await this.fileUploadService.fileExists(findPrize.image);
                if (fileExists) {
                    await this.fileUploadService.deleteFile(findPrize.image);
                }
            }

            image = await this.fileUploadService.uploadFile(imageData, `wheel/${findWheel.slug}/prizes`);
        }

        delete prizeData.slug;

        await this.prisma.wheelPrize.update({
            where: { id },
            data: {
                ...prizeData,
                wheelId: findWheel.id,
                image,
                isComplete: Boolean(prizeData.isComplete),
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is updating WheelPrizes with ID ${id}.`);

        return 'Update prize success!';
    }

    async deleteWheelPrize(id: string, request: Request): Promise<string> {
        const findPrize = await this.prisma.wheelPrize.findUnique({ where: { id } });

        if (!findPrize) {
            throw new NotFoundException();
        }

        if (findPrize.image.trim().length > 0) {
            const fileExists = await this.fileUploadService.fileExists(findPrize.image);
            if (fileExists) {
                await this.fileUploadService.deleteFile(findPrize.image);
            }
        }

        await this.prisma.wheelPrize.delete({ where: { id: findPrize.id } });

        this.logger.log(`User ${request['user'].sub.id} is deleting WheelPrize with ID ${id}.`);

        return 'Delete prize success!';
    }
}
