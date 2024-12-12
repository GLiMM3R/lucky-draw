import { Draw, DrawPrize, User } from '@prisma/client';

export class ResponseDraw {
    id: string;
    slug: string;
    title: string;
    prizeCap: number;
    dataset: string;
    backgroundImage: string;
    loadingImage: string;
    device: string;
    isComplete: boolean;
    createdBy: object;
    createdAt: Date;
    updatedAt: Date;

    constructor(draw: Draw, user: User) {
        this.id = draw.id;
        this.slug = draw.slug;
        this.title = draw.title;
        this.prizeCap = draw.prizeCap;
        this.dataset = draw.dataset;
        this.backgroundImage = draw.backgroundImage;
        this.loadingImage = draw.loadingImage;
        this.device = draw.device;
        this.isComplete = draw.isComplete;
        this.createdBy = {
            id: user.id,
            username: user.username,
        };
        this.createdAt = draw.createdAt;
        this.updatedAt = draw.updatedAt;
    }
}

export class ResponseDrawWithPrize {
    id: string;
    slug: string;
    title: string;
    prizeCap: number;
    dataset: string;
    backgroundImage: string;
    loadingImage: string;
    device: string;
    prizes: DrawPrize[];
    isComplete: boolean;
    createdBy: object;
    createdAt: Date;
    updatedAt: Date;

    constructor(draw: Draw, user: User, prizes: DrawPrize[]) {
        this.id = draw.id;
        this.slug = draw.slug;
        this.title = draw.title;
        this.prizeCap = draw.prizeCap;
        this.dataset = draw.dataset;
        this.backgroundImage = draw.backgroundImage;
        this.loadingImage = draw.loadingImage;
        this.device = draw.device;
        this.isComplete = draw.isComplete;
        this.createdBy = {
            id: user.id,
            username: user.username,
        };
        this.prizes = prizes;
        this.createdAt = draw.createdAt;
        this.updatedAt = draw.updatedAt;
    }
}
