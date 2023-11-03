import { User, Wheel, WheelPrize } from '@prisma/client';

export class ResponseWheel {
    id: string;
    slug: string;
    title: string;
    baseIcon: string;
    isComplete: boolean;
    createdBy: object;
    createdAt: Date;
    updatedAt: Date;

    constructor(wheel: Wheel, user: User) {
        this.id = wheel.id;
        this.slug = wheel.slug;
        this.title = wheel.title;
        this.baseIcon = wheel.baseIcon;
        this.isComplete = wheel.isComplete;
        this.createdBy = {
            id: user.id,
            username: user.username,
        };
        this.createdAt = wheel.createdAt;
        this.updatedAt = wheel.updatedAt;
    }
}

export class ResponseWheelWithPrize {
    id: string;
    slug: string;
    title: string;
    baseIcon: string;
    prizes: WheelPrize[];
    isComplete: boolean;
    createdBy: object;
    createdAt: Date;
    updatedAt: Date;

    constructor(wheel: Wheel, user: User, prizes: WheelPrize[]) {
        this.id = wheel.id;
        this.slug = wheel.slug;
        this.title = wheel.title;
        this.baseIcon = wheel.baseIcon;
        this.prizes = prizes;
        this.isComplete = wheel.isComplete;
        this.createdBy = {
            id: user.id,
            username: user.username,
        };
        this.createdAt = wheel.createdAt;
        this.updatedAt = wheel.updatedAt;
    }
}
