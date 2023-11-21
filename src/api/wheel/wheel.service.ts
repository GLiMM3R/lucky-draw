import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { LanguageService } from '../../config/lang/language.service';
import { PrismaService } from '../../config/prisma/prisma.service';
import { ResponseWheel } from './dto/response-wheel.dto';
import { CreateWheel } from './dto/create-wheel.dto';
import { stringToSlug } from '../../util/stringToSlug';
import { UpdateWheel } from './dto/update-wheel.dto';
import { FileUploadService } from '../../services/file-upload/file-upload.service';
import { DuplicateWheel } from './dto/duplicate-wheel.dto';
import * as path from 'path';
import { Request } from 'express';
import { LoggerService } from '../../services/logger/logger.service';

@Injectable()
export class WheelService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly languageService: LanguageService,
        private readonly logger: LoggerService,
    ) {}
    async getWheels(request: Request): Promise<ResponseWheel[]> {
        const wheels = await this.prisma.wheel.findMany({
            include: {
                createdBy: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is fetching WheelDraws.`);

        return wheels.map((item) => new ResponseWheel(item, item.createdBy));
    }

    async getWheelById(id: string, request: Request): Promise<ResponseWheel> {
        if (!id) {
            throw new BadRequestException();
        }

        const findWheel = await this.prisma.wheel.findUnique({
            where: { id },
            include: {
                createdBy: true,
            },
        });

        if (!findWheel) {
            throw new NotFoundException();
        }

        this.logger.log(`User ${request['user'].sub.id} is fetching WheelDraw with ID ${id}.`);

        return new ResponseWheel(findWheel, findWheel.createdBy);
    }

    async getWheelBySlug(slug: string, request: Request): Promise<ResponseWheel> {
        if (!slug) {
            throw new BadRequestException();
        }

        const findWheel = await this.prisma.wheel.findUnique({
            where: { slug },
            include: {
                createdBy: true,
            },
        });

        if (!findWheel) {
            throw new NotFoundException();
        }

        this.logger.log(`User ${request['user'].sub.id} is fetching WheelDraw with Slug ${slug}.`);

        return new ResponseWheel(findWheel, findWheel.createdBy);
    }

    async createWheel(wheelData: CreateWheel, request: Request, imageData?: Express.Multer.File): Promise<string> {
        const slug = stringToSlug(wheelData.title);

        let baseIcon = '';

        const newWheel = await this.prisma.wheel.create({
            data: {
                ...wheelData,
                slug,
                baseIcon,
                userId: request['user'].sub.id,
            },
        });

        if (imageData) {
            baseIcon = await this.fileUploadService.uploadFile(imageData, `wheel/${newWheel.id}/baseIcon`);
        }

        await this.prisma.wheel.update({
            where: {
                id: newWheel.id,
            },
            data: {
                baseIcon,
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is creating WheelDraw with ID ${newWheel.id}.`);

        return 'Create success';
    }

    async updateWheel(id: string, wheelData: UpdateWheel, request: Request, imageData?: Express.Multer.File): Promise<string> {
        const findWheel = await this.prisma.wheel.findUnique({ where: { id } });

        if (!findWheel) {
            throw new NotFoundException();
        }

        let baseIcon = findWheel.baseIcon;

        if (imageData) {
            if (findWheel.baseIcon.trim()) {
                const fileExists = await this.fileUploadService.fileExists(findWheel.baseIcon);

                if (fileExists) {
                    await this.fileUploadService.deleteFile(findWheel.baseIcon);
                }
            }

            baseIcon = await this.fileUploadService.uploadFile(imageData, `wheel/${findWheel.id}/baseIcon`);
        }

        await this.prisma.wheel.update({
            where: { id },
            data: {
                ...wheelData,
                baseIcon,
                slug: stringToSlug(wheelData.title),
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is updating WheelDraw with ID ${id}.`);

        return 'Update success!';
    }

    async removeBaseIcon(id: string, request: Request): Promise<string> {
        const findWheel = await this.prisma.wheel.findUnique({ where: { id } });

        if (!findWheel) {
            throw new NotFoundException();
        }

        if (findWheel.baseIcon && findWheel.baseIcon !== '') {
            await this.fileUploadService.deleteFile(findWheel.baseIcon);
        }

        await this.prisma.wheel.update({
            where: { id },
            data: {
                baseIcon: '',
            },
        });

        this.logger.log(`User ${request['user'].sub.id} is removing BaseIcon WheelDraw with ID ${id}.`);

        return 'Update success!';
    }

    async deleteWheel(id: string, request: Request): Promise<string> {
        const findWheel = await this.prisma.wheel.findUnique({ where: { id } });

        if (!findWheel) {
            throw new NotFoundException();
        }

        if (findWheel.baseIcon.trim()) {
            const fileExists = await this.fileUploadService.fileExists(findWheel.baseIcon);

            if (fileExists) {
                await this.fileUploadService.deleteFile(findWheel.baseIcon);
            }
        }

        await this.prisma.wheel.delete({
            where: { id: findWheel.id },
        });

        this.logger.log(`User ${request['user'].sub.id} is deleting WheelDraw with ID ${id}.`);

        return 'Delete success!';
    }

    async duplicateCampaign(id: string, wheelData: DuplicateWheel, request: Request): Promise<string> {
        const [findWheel, findExist] = await Promise.all([
            this.prisma.wheel.findUnique({ where: { id } }),
            this.prisma.wheel.findFirst({ where: { title: wheelData.title, slug: stringToSlug(wheelData.title) } }),
        ]);

        if (!findWheel) {
            throw new BadRequestException();
        }

        if (findExist) {
            throw new BadRequestException('Already exits');
        }

        let baseIcon = '';

        const newWheel = await this.prisma.wheel.create({
            data: {
                slug: stringToSlug(wheelData.title),
                title: wheelData.title,
                baseIcon: findWheel.baseIcon,
                userId: request['user'].sub.id,
            },
        });

        if (findWheel.baseIcon) {
            baseIcon = `wheel/${newWheel.id}/baseIcon/${path.basename(findWheel.baseIcon)}`;
            const folder = `wheel/${newWheel.id}/baseIcon/`;

            await this.fileUploadService.copyFile(findWheel.baseIcon, folder, path.basename(findWheel.baseIcon));
        }

        await this.prisma.wheel.update({
            where: {
                id: newWheel.id,
            },
            data: {
                baseIcon: baseIcon,
            },
        });

        const findPrizes = await this.prisma.wheelPrize.findMany({ where: { wheelId: findWheel.id } });

        await Promise.all(
            findPrizes.map(async (item) => {
                let image = '';

                if (item.image) {
                    image = `wheel/${newWheel.id}/prizes/${path.basename(item.image)}`;
                    const folder = `wheel/${newWheel.id}/prizes/`;

                    await this.fileUploadService.copyFile(item.image, folder, path.basename(item.image));
                }

                await this.prisma.wheelPrize.create({
                    data: {
                        wheelId: newWheel.id,
                        title: item.title,
                        amount: item.amount,
                        image: image,
                        userId: request['user'].sub.id,
                    },
                });
            }),
        );

        this.logger.log(`User ${request['user'].sub.id} is duplicating WheelDraw with ID ${id}.`);

        return 'Duplicate success!';
    }
}
