import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { LanguageService } from 'src/config/lang/language.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ResponseWheel } from './dto/response-wheel.dto';
import { CreateWheel } from './dto/create-wheel.dto';
import { stringToSlug } from 'src/util/stringToSlug';
import { UpdateWheel } from './dto/update-wheel.dto';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';

@Injectable()
export class WheelService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly languageService: LanguageService,
    ) {}
    async getWheels(): Promise<ResponseWheel[]> {
        const wheels = await this.prisma.wheel.findMany({
            include: {
                createdBy: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return wheels.map((item) => new ResponseWheel(item, item.createdBy));
    }

    async getWheelById(id: string): Promise<ResponseWheel> {
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

        return new ResponseWheel(findWheel, findWheel.createdBy);
    }

    async getWheelBySlug(slug: string): Promise<ResponseWheel> {
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

        return new ResponseWheel(findWheel, findWheel.createdBy);
    }

    async createWheel(wheelData: CreateWheel, request: Request, imageData: Express.Multer.File): Promise<string> {
        const slug = stringToSlug(wheelData.title);
        let baseIcon = '';

        if (imageData) {
            baseIcon = await this.fileUploadService.uploadFile(imageData, `wheel/${slug}/baseIcon`);
        }

        await this.prisma.wheel.create({
            data: {
                ...wheelData,
                slug,
                baseIcon,
                userId: request['user'].sub.id,
            },
        });

        return 'Create success';
    }

    async updateWheel(id: string, wheelData: UpdateWheel, imageData?: Express.Multer.File): Promise<string> {
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

            baseIcon = await this.fileUploadService.uploadFile(imageData, `wheel/${findWheel.slug}/baseIcon`);
        }

        await this.prisma.wheel.update({
            where: { id },
            data: {
                ...wheelData,
                baseIcon,
                slug: stringToSlug(wheelData.title),
            },
        });

        return 'Update success!';
    }

    async deleteWheel(id: string): Promise<string> {
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

        return 'Delete success!';
    }
}
