import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LanguageService } from 'src/config/lang/language.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { UpdateWheelPrize } from './dto/update-wheel-prize.dto';
import { Request } from 'express';
import { ResponseWheelPrize, ResponseWheelPrizeWithWinner } from './dto/response-wheel-prize.dto';
import { CreateWheelPrize } from './dto/create-wheel-prize.dto';

@Injectable()
export class WheelPrizeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly languageService: LanguageService,
    ) {}

    async getWheelPrizes(wheelId?: string): Promise<ResponseWheelPrize[]> {
        if (!wheelId) {
            throw new BadRequestException();
        }
        const findPrizes = await this.prisma.wheelPrize.findMany({
            include: {
                createdBy: true,
            },
        });

        return findPrizes.map((item) => new ResponseWheelPrize(item, item.createdBy));
    }

    async getWheelPrizeById(id: string): Promise<ResponseWheelPrize> {
        if (!id) {
            throw new BadRequestException();
        }
        const findPrize = await this.prisma.wheelPrize.findUnique({
            where: { id },
            include: {
                createdBy: true,
            },
        });

        if (!findPrize) {
            throw new NotFoundException();
        }

        return new ResponseWheelPrize(findPrize, findPrize.createdBy);
    }

    async getWheelPrizeBySlug(slug: string): Promise<ResponseWheelPrize[]> {
        if (!slug) {
            throw new BadRequestException();
        }

        const findWheel = await this.prisma.wheel.findUnique({ where: { slug } });

        const findPrizes = await this.prisma.wheelPrize.findMany({
            where: { wheelId: findWheel.id },
            include: {
                createdBy: true,
            },
        });

        return findPrizes.map((item) => new ResponseWheelPrize(item, item.createdBy));
    }

    async getWinnerWheelPrizesBySlug(slug: string): Promise<ResponseWheelPrizeWithWinner[]> {
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

        return 'Create prize success!';
    }

    async updateWheelPrize(id: string, prizeData: UpdateWheelPrize, imageData?: Express.Multer.File): Promise<string> {
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

        await this.prisma.wheelPrize.update({
            where: { id },
            data: {
                ...prizeData,
                wheelId: findWheel.id,
                image,
                isComplete: Boolean(prizeData.isComplete),
            },
        });

        return 'Update prize success!';
    }

    async deleteWheelPrize(id: string): Promise<string> {
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

        return 'Delete prize success!';
    }
}
