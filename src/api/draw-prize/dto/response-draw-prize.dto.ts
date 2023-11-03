import { DrawPrize, DrawReport, User } from '@prisma/client';

export class ResponseDrawPrize {
    id: string;
    drawId: string;
    rank: number;
    title: string;
    amount: number;
    image: string;
    isComplete: boolean;
    createdBy: object;
    createdAt: Date;
    updatedAt: Date;

    constructor(prize: DrawPrize, user: User) {
        this.id = prize.id;
        this.drawId = prize.drawId;
        this.rank = prize.rank;
        this.amount = prize.amount;
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

export class ResponseDrawPrizeWithWinner {
    id: string;
    drawId: string;
    rank: number;
    title: string;
    amount: number;
    image: string;
    winners: DrawReport[];
    isComplete: boolean;
    createdBy: object;
    createdAt: Date;
    updatedAt: Date;

    constructor(prize: DrawPrize, user: User, winners: DrawReport[]) {
        this.id = prize.id;
        this.drawId = prize.drawId;
        this.rank = prize.rank;
        this.amount = prize.amount;
        this.title = prize.title;
        this.image = prize.image;
        this.isComplete = prize.isComplete;
        this.createdBy = {
            id: user.id,
            username: user.username,
        };
        this.winners = winners;
        this.createdAt = prize.createdAt;
        this.updatedAt = prize.updatedAt;
    }
}
