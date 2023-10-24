import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { LanguageService } from 'src/config/lang/language.service';
import { ResponseCouponDto } from './dto/response-coupon.dto';
import { Request } from 'express';

@Injectable()
export class CouponsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly languageService: LanguageService,
    ) {}
    async createCoupon(createCouponDto: CreateCouponDto, request: Request) {
        const user = await this.prisma.user.findUnique({ where: { id: request['user'].sub.id } });

        if (!user) {
            throw new UnauthorizedException(this.languageService.TOKEN_INVALID());
        }

        if (!createCouponDto) {
            throw new BadRequestException();
        }

        const findCampaign = await this.prisma.campaign.findUnique({ where: { slug: createCouponDto.campaignSlug } });

        if (!findCampaign) {
            throw new BadRequestException();
        }

        return await this.prisma.coupon.create({
            data: {
                campaignId: findCampaign.id,
                name: createCouponDto.name,
                phone: createCouponDto.phone,
                createdById: user.id,
            },
        });
    }

    async getCoupons(campaignId: string) {
        return await this.prisma.coupon.findMany({
            where: {
                campaignId: campaignId,
            },
            include: {
                campaign: true,
                createdBy: true,
            },
            orderBy: {
                isNew: 'desc',
            },
        });
    }

    async getCoupon(id: string): Promise<ResponseCouponDto> {
        const findCoupon = await this.prisma.coupon.findUnique({
            where: { id },
            include: {
                campaign: true,
                createdBy: true,
            },
        });

        if (!findCoupon) {
            throw new NotFoundException();
        }

        return findCoupon;
    }

    async updateCoupon(id: string, updateCouponDto: UpdateCouponDto) {
        const findCoupon = await this.prisma.coupon.findUnique({
            where: { id },
        });

        if (!findCoupon) {
            throw new NotFoundException();
        }

        return await this.prisma.coupon.update({
            where: { id },
            data: { ...updateCouponDto },
        });
    }

    async removeCoupon(id: string) {
        const findCoupon = await this.prisma.coupon.findUnique({
            where: { id },
        });

        if (!findCoupon) {
            throw new NotFoundException();
        }

        return await this.prisma.coupon.delete({
            where: { id: findCoupon.id },
        });
    }
}
