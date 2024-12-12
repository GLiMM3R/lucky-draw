import { Draw, DrawPrize, DrawReport, User } from '@prisma/client';

export class ResponseDrawReport {
    id: string;
    drawId: string;
    prizeId: string;
    customerId: string;
    name: string;
    phone: string;
    createdBy: object;
    createdAt: Date;
    updatedAt: Date;

    constructor(report: DrawReport, user: User) {
        this.id = report.id;
        this.drawId = report.drawId;
        this.prizeId = report.prizeId;
        this.customerId = report.customerId;
        this.name = report.name;
        this.phone = report.phone;
        this.createdBy = {
            id: user.id,
            username: user.username,
        };
        this.createdAt = report.createdAt;
        this.updatedAt = report.updatedAt;
    }
}

export class ResponseDrawReportWithIncludes {
    id: string;
    draw: Draw;
    prize: DrawPrize;
    customerId: string;
    name: string;
    phone: string;
    createdBy: object;
    createdAt: Date;
    updatedAt: Date;

    constructor(report: DrawReport, draw: Draw, prize: DrawPrize, user: User) {
        this.id = report.id;
        this.draw = draw;
        this.prize = prize;
        this.customerId = report.customerId;
        this.name = report.name;
        this.phone = report.phone;
        this.createdBy = {
            id: user.id,
            username: user.username,
        };
        this.createdAt = report.createdAt;
        this.updatedAt = report.updatedAt;
    }
}
