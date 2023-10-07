import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LanguageService } from 'src/config/lang/language.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { UpdatePrizeDto } from './dto/update-prize.dto';
import { Request } from 'express';

@Injectable()
export class PrizeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly languageService: LanguageService,
    ) {}

    async getPrizes(campaignId: string) {
        return await this.prisma.prize.findMany({
            where: {
                campaignId: campaignId,
            },
            include: {
                createdBy: true,
            },
            orderBy: {
                rank: 'desc',
            },
        });
    }

    async getPrize(id: string) {
        return await this.prisma.prize.findUnique({
            where: {
                id,
            },
        });
    }

    async createPrize(prizeData: CreatePrizeDto, request: Request, imageData?: Express.Multer.File) {
        if (!request['user']) {
            throw new UnauthorizedException(this.languageService.TOKEN_INVALID());
        }

        const user = await this.prisma.user.findUnique({ where: { id: request['user'].sub.id } });

        if (imageData) {
            const img = await this.fileUploadService.uploadFile(imageData, 'prizes');
            return await this.prisma.prize.create({
                data: {
                    ...prizeData,
                    rank: Number(prizeData.rank) || 0,
                    amount: Number(prizeData.amount) || 0,
                    image: img,
                    createdById: user.id,
                },
            });
        }

        return await this.prisma.prize.create({
            data: {
                ...prizeData,
                rank: Number(prizeData.rank) || 0,
                amount: Number(prizeData.amount) || 0,
                image: '',
                createdById: user.id,
            },
        });
    }

    async updatePrize(id: string, prizeData: UpdatePrizeDto, imageData?: Express.Multer.File) {
        const findPrize = await this.prisma.prize.findUnique({ where: { id } });

        if (!findPrize) {
            throw new NotFoundException();
        }

        if (imageData) {
            if (findPrize.image.trim().length > 0) {
                const fileExists = await this.fileUploadService.fileExists(findPrize.image);
                if (fileExists) {
                    await this.fileUploadService.deleteFile(findPrize.image);
                }
            }

            const image = await this.fileUploadService.uploadFile(imageData, 'prizes');

            return await this.prisma.prize.update({
                where: { id },
                data: {
                    ...prizeData,
                    rank: Number(prizeData.rank),
                    amount: Number(prizeData.amount),
                    image: image,
                    isActive: Boolean(prizeData.isActive),
                },
            });
        }

        return await this.prisma.prize.update({
            where: { id },
            data: {
                ...prizeData,
                rank: Number(prizeData.rank),
                amount: Number(prizeData.amount),
                image: findPrize.image,
                isActive: Boolean(prizeData.isActive),
            },
        });
    }
}
