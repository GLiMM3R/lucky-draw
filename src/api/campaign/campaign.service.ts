import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { LanguageService } from 'src/config/lang/language.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { selectFields } from 'src/util/selectField.util';

@Injectable()
export class CampaignService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly languageService: LanguageService,
        private readonly fileUploadService: FileUploadService,
    ) {}

    async getCampaigns(type?: string, field?: string | string[]) {
        const fields = selectFields(field);

        return await this.prisma.campaign.findMany({
            include: {
                ...fields,
            },
            where: {
                type,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getCampaign(id: string, field?: string | string[]) {
        const fields = selectFields(field);

        return await this.prisma.campaign.findUnique({
            where: { id },
            include: {
                ...fields,
                prizes: {
                    include: {
                        createdBy: true,
                    },
                },
                coupon: {
                    include: {
                        createdBy: true,
                    },
                },
            },
        });
    }

    async createCampaign(campaignData: CreateCampaignDto, request: Request) {
        if (!request['user']) {
            throw new UnauthorizedException(this.languageService.TOKEN_INVALID());
        }

        const user = await this.userService.getUser(request['user'].sub.id);

        return await this.prisma.campaign.create({ data: { ...campaignData, createdById: user.id } });
    }

    async updateCampaign(id: string, campaignData: UpdateCampaignDto, file?: Express.Multer.File) {
        const findCampaign = await this.prisma.campaign.findUnique({ where: { id } });

        if (!findCampaign) {
            throw new NotFoundException();
        }

        if (file) {
            if (findCampaign.file !== null) {
                await this.fileUploadService.deleteFile(findCampaign.file);
            }

            const uploadFile = await this.fileUploadService.uploadFile(file, `coupon/${findCampaign.id}`, false);

            return await this.prisma.campaign.update({
                where: { id },
                data: {
                    ...campaignData,
                    file: uploadFile,
                },
            });
        } else {
            return await this.prisma.campaign.update({
                where: { id },
                data: {
                    title: campaignData.title,
                    prizeCap: Number(campaignData.prizeCap),
                    isActive: campaignData.isActive,
                },
            });
        }
    }

    async removeCampaign(id: string) {
        const findCampaign = await this.prisma.campaign.findUnique({ where: { id } });
        console.log('🚀 ~ file: campaign.service.ts:97 ~ CampaignService ~ removeCampaign ~ findCampaign:', findCampaign);

        if (!findCampaign) {
            throw new NotFoundException();
        }

        return await this.prisma.campaign.delete({
            where: { id: findCampaign.id },
        });
    }
}
