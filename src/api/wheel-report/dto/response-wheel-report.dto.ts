import { User, Wheel, WheelPrize, WheelReport } from '@prisma/client';

export class ResponseWheelReport {
    id: string;
    wheel: Wheel;
    prize: WheelPrize;
    createdBy: object;
    createdAt: Date;
    updatedAt: Date;

    constructor(report: WheelReport, wheel: Wheel, prize: WheelPrize, user: User) {
        this.id = report.id;
        this.wheel = wheel;
        this.prize = prize;
        this.createdBy = {
            id: user.id,
            username: user.username,
        };
        this.createdAt = report.createdAt;
        this.updatedAt = report.updatedAt;
    }
}
