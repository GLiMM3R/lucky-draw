import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../config/prisma/prisma.service';
// import * as moment from 'moment';

@Injectable()
export class TaskingService {
    //   private readonly logger = new Logger(TaskingService.name);
    constructor(private readonly prisma: PrismaService) {}

    @Cron(CronExpression.EVERY_5_MINUTES, {
        name: 'otp',
        timeZone: 'Asia/bangkok',
    })
    async handleCronBanner(): Promise<any> {
        // NOTE: if OTP is ended, then delete it
        const emailOTP = await this.prisma.emailOTP.findMany({});

        // NOTE: get current time
        const now = new Date();
        const _minutesInMs = 1000 * 60;

        // NOTE: delete email phone if it is ended
        for (const OTP of emailOTP) {
            const _expiredTime = new Date(OTP.createdAt.getTime() + _minutesInMs);

            if (_expiredTime < now) {
                await this.prisma.emailOTP.delete({
                    where: {
                        id: OTP.id,
                    },
                });
            }
        }
    }

    // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    //     name: 'otp',
    //     timeZone: 'Asia/bangkok',
    // })
    // async handleUserDeleted(): Promise<any> {
    //     const customers = await this.prisma.customers.findMany({
    //         where: {
    //             isDelete: true,
    //         },
    //     });

    //     const currentDate = new Date();
    //     const _daysInMs = 1000 * 60 * 60 * 24;

    //     customers.map(async (item) => {
    //         const diffDate = Math.floor((currentDate.getTime() - item.deletedAt.getTime()) / _daysInMs);

    //         if (diffDate > 30) {
    //             await this.prisma.customers.delete({
    //                 where: { id: item.id },
    //             });
    //         }
    //     });
    // }
}
