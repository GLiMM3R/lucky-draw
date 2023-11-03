import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LanguageService } from 'src/config/lang/language.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { Request } from 'express';
import { ResponseDrawPrize, ResponseDrawPrizeWithWinner } from './dto/response-draw-prize.dto';
import { CreateDrawPrize } from './dto/create-draw-prize.dto';
import { UpdateDrawPrize } from './dto/update-draw-prize.dto';

@Injectable()
export class DrawPrizeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly languageService: LanguageService,
    ) {}

    async getDrawPrizes(drawId?: string): Promise<ResponseDrawPrize[]> {
        if (!drawId) {
            throw new BadRequestException();
        }

        const findPrizes = await this.prisma.drawPrize.findMany({
            where: {
                drawId,
            },
            include: {
                createdBy: true,
            },
            orderBy: {
                rank: 'desc',
            },
        });

        return findPrizes.map((item) => new ResponseDrawPrize(item, item.createdBy));
    }

    async getDrawPrizeById(id: string): Promise<ResponseDrawPrize> {
        if (!id) {
            throw new BadRequestException();
        }
        const findPrize = await this.prisma.drawPrize.findUnique({
            where: { id },
            include: {
                createdBy: true,
            },
        });

        if (!findPrize) {
            throw new NotFoundException();
        }

        return new ResponseDrawPrize(findPrize, findPrize.createdBy);
    }

    async getDrawPrizesBySlug(slug: string): Promise<ResponseDrawPrize[]> {
        if (!slug) {
            throw new BadRequestException();
        }

        const findRandom = await this.prisma.draw.findUnique({ where: { slug } });

        const findPrizes = await this.prisma.drawPrize.findMany({
            where: { drawId: findRandom.id },
            include: {
                createdBy: true,
            },
        });

        return findPrizes.map((item) => new ResponseDrawPrize(item, item.createdBy));
    }

    async getWinnerDrawPrizesBySlug(slug: string): Promise<ResponseDrawPrizeWithWinner[]> {
        if (!slug) {
            throw new BadRequestException();
        }

        const findRandom = await this.prisma.draw.findUnique({ where: { slug } });

        const findPrize = await this.prisma.drawPrize.findMany({
            where: { drawId: findRandom.id },
            include: {
                createdBy: true,
                winners: true,
            },
        });

        return findPrize.map((item) => new ResponseDrawPrizeWithWinner(item, item.createdBy, item.winners));
    }

    async createDrawPrize(prizeData: CreateDrawPrize, request: Request, imageData?: Express.Multer.File): Promise<string> {
        const findDraw = await this.prisma.draw.findUnique({ where: { slug: prizeData.slug } });

        if (!findDraw) {
            throw new NotFoundException();
        }

        let image = '';

        if (imageData) {
            image = await this.fileUploadService.uploadFile(imageData, `draw/${findDraw.slug}/prizes`);
        }

        await this.prisma.drawPrize.create({
            data: {
                drawId: findDraw.id,
                title: prizeData.title,
                rank: prizeData.rank,
                amount: prizeData.amount,
                image: image,
                userId: request['user'].sub.id,
            },
        });

        return 'Create prize success!';
    }

    async updateDrawPrize(id: string, prizeData: UpdateDrawPrize, imageData?: Express.Multer.File): Promise<string> {
        const findDraw = await this.prisma.draw.findUnique({ where: { slug: prizeData.slug } });

        if (!findDraw) {
            throw new NotFoundException();
        }

        const findPrize = await this.prisma.drawPrize.findUnique({ where: { id } });

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

            image = await this.fileUploadService.uploadFile(imageData, `draw/${findDraw.slug}/prizes`);
        }

        await this.prisma.drawPrize.update({
            where: { id },
            data: {
                ...prizeData,
                drawId: findDraw.id,
                image: image,
                isComplete: Boolean(prizeData.isComplete),
            },
        });

        return 'Update prize success!';
    }

    async deleteDrawPrize(id: string): Promise<string> {
        const findPrize = await this.prisma.drawPrize.findUnique({ where: { id } });

        if (!findPrize) {
            throw new NotFoundException();
        }

        if (findPrize.image.trim()) {
            const fileExists = await this.fileUploadService.fileExists(findPrize.image);
            if (fileExists) {
                await this.fileUploadService.deleteFile(findPrize.image);
            }
        }

        await this.prisma.drawPrize.delete({ where: { id: findPrize.id } });

        return 'Delete prize success!';
    }
}
