import { Campaign, Coupon, Prize, User } from '@prisma/client';

export class ResponseCampaignDto {
    id: string;
    slug: string;
    title: string;
    prizeCap: number;
    type: string;
    file: string;
    prizes: Prize[];
    createdBy: User;
    coupons: Coupon[];
    isDone: boolean;
    isActive: boolean;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(campaign: Campaign, user: User, prizes: Prize[], coupons: Coupon[]) {
        this.id = campaign.id;
        this.slug = campaign.slug;
        this.title = campaign.title;
        this.prizeCap = campaign.prizeCap;
        this.type = campaign.type;
        this.file = campaign.file;
        this.isDone = campaign.isDone;
        this.isActive = campaign.isActive;
        this.createdBy = user;
        this.prizes = prizes;
        this.coupons = coupons;
        this.createdAt = campaign.createdAt;
        this.updatedAt = campaign.updatedAt;
    }
}
