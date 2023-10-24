import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { LanguageService } from 'src/config/lang/language.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { selectFields } from 'src/util/selectField.util';
import { ResponseCampaignDto } from './dto/response-campaign.dto';
import { stringToSlug } from 'src/util/stringToSlug';

@Injectable()
export class CampaignService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly languageService: LanguageService,
        private readonly fileUploadService: FileUploadService,
    ) {}

    async validateCampaign(title: string) {
        const isExists = await this.prisma.campaign.findUnique({
            where: {
                title: title,
            },
        });

        return !!isExists;
    }

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

    async getCampaign(id: string): Promise<ResponseCampaignDto> {
        const findCampaign = await this.prisma.campaign.findUnique({
            where: { id },
            include: {
                prizes: {
                    include: {
                        createdBy: true,
                        _count: {
                            select: {
                                winnerRecord: true,
                            },
                        },
                    },
                    orderBy: {
                        rank: 'asc',
                    },
                },
                coupons: {
                    where: {
                        isNew: true,
                    },
                    include: {
                        createdBy: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
                createdBy: true,
            },
        });

        if (!findCampaign) {
            throw new NotFoundException();
        }

        delete findCampaign.createdBy.password;

        const prizes = findCampaign.prizes.map((item) => {
            return {
                ...item,
                leftAmount: item.amount - item._count.winnerRecord,
            };
        });

        return new ResponseCampaignDto(findCampaign, findCampaign.createdBy, prizes, findCampaign.coupons);
    }

    async getCampaignBySlug(slug: string): Promise<ResponseCampaignDto> {
        const findCampaign = await this.prisma.campaign.findUnique({
            where: { slug },
            include: {
                prizes: {
                    include: {
                        createdBy: true,
                        _count: {
                            select: {
                                winnerRecord: true,
                            },
                        },
                    },
                    orderBy: {
                        rank: 'asc',
                    },
                },
                coupons: {
                    where: {
                        isNew: true,
                    },
                    include: {
                        createdBy: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
                createdBy: true,
            },
        });

        if (!findCampaign) {
            throw new NotFoundException();
        }

        delete findCampaign.createdBy.password;

        const prizes = findCampaign.prizes.map((item) => {
            return {
                ...item,
                leftAmount: item.amount - item._count.winnerRecord,
            };
        });

        return new ResponseCampaignDto(findCampaign, findCampaign.createdBy, prizes, findCampaign.coupons);
    }

    async createCampaign(campaignData: CreateCampaignDto, request: Request) {
        if (!request['user']) {
            throw new UnauthorizedException(this.languageService.TOKEN_INVALID());
        }

        const user = await this.userService.getUser(request['user'].sub.id);

        return await this.prisma.campaign.create({
            data: {
                ...campaignData,
                title: campaignData.title.trim().toLowerCase(),
                type: campaignData.type.trim().toLowerCase(),
                slug: stringToSlug(campaignData.title),
                createdById: user.id,
            },
        });
    }

    async updateCampaign(id: string, campaignData: UpdateCampaignDto) {
        const findCampaign = await this.prisma.campaign.findUnique({ where: { id } });

        if (!findCampaign) {
            throw new NotFoundException();
        }

        return await this.prisma.campaign.update({
            where: { id },
            data: {
                ...campaignData,
                slug: stringToSlug(campaignData.title),
            },
        });
    }

    async updateDataset(id: string, file?: Express.Multer.File) {
        const findCampaign = await this.prisma.campaign.findUnique({ where: { id } });

        if (!findCampaign) {
            throw new NotFoundException();
        }

        if (file) {
            if (findCampaign.file && findCampaign.file !== '') {
                await this.fileUploadService.deleteFile(findCampaign.file);
            }

            const uploadFile = await this.fileUploadService.uploadFile(file, `dataset/${findCampaign.slug}`, false);

            return await this.prisma.campaign.update({
                where: { id },
                data: {
                    file: uploadFile,
                },
            });
        } else {
            if (findCampaign.file.trim().length > 0) {
                const fileExists = await this.fileUploadService.fileExists(findCampaign.file);
                if (fileExists) {
                    await this.fileUploadService.deleteFile(findCampaign.file);
                }
            }

            return await this.prisma.campaign.update({
                where: { id },
                data: {
                    file: '',
                },
            });
        }
    }

    async removeCampaign(id: string) {
        const findCampaign = await this.prisma.campaign.findUnique({ where: { id } });

        if (!findCampaign) {
            throw new NotFoundException();
        }

        if (findCampaign.file.trim().length > 0) {
            const fileExists = await this.fileUploadService.fileExists(findCampaign.file);
            if (fileExists) {
                await this.fileUploadService.deleteFile(findCampaign.file);
            }
        }

        return await this.prisma.campaign.delete({
            where: { id: findCampaign.id },
        });
    }
}
