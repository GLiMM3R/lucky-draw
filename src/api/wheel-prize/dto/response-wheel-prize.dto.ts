import { User, WheelPrize, WheelReport } from '@prisma/client';

export class ResponseWheelPrize {
    id: string;
    wheelId: string;
    title: string;
    amount: number;
    image: string;
    isComplete: boolean;
    createdBy: object;
    createdAt: Date;
    updatedAt: Date;

    constructor(prize: WheelPrize, user: User) {
        this.id = prize.id;
        this.wheelId = prize.wheelId;
        this.title = prize.title;
        this.image = prize.image;
        this.isComplete = prize.isComplete;
        this.createdBy = {
            id: user.id,
            username: user.username,
        };
        this.createdAt = prize.createdAt;
        this.updatedAt = prize.updatedAt;
    }
}

export class ResponseWheelPrizeWithWinner {
    id: string;
    wheelId: string;
    title: string;
    amount: number;
    image: string;
    winners: WheelReport[];
    isComplete: boolean;
    createdBy: object;
    createdAt: Date;
    updatedAt: Date;

    constructor(prize: WheelPrize, user: User, winners: WheelReport[]) {
        this.id = prize.id;
        this.wheelId = prize.wheelId;
        this.title = prize.title;
        this.image = prize.image;
        this.winners = winners;
        this.isComplete = prize.isComplete;
        this.createdBy = {
            id: user.id,
            username: user.username,
        };
        this.createdAt = prize.createdAt;
        this.updatedAt = prize.updatedAt;
    }
}
