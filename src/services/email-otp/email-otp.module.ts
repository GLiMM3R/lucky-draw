import { Module } from '@nestjs/common';
import { EmailOtpService } from './email-otp.service';
import { EmailOtpController } from './email-otp.controller';
import { PrismaModule } from '../../config/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [EmailOtpController],
    providers: [EmailOtpService],
})
export class EmailOtpModule {}
