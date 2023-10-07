import { Coupon } from '@prisma/client';

export class ResponseCouponDto {
    id: string;
    campaign: object;
    isNew: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(coupon: Coupon) {
        this.id = coupon.id;
        this.isNew = coupon.isNew;
        this.createdAt = coupon.createdAt;
        this.updatedAt = coupon.updatedAt;
    }
}
