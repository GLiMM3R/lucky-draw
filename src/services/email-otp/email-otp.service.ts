import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { emailTemplate } from './dto/mail-template';
import * as crypto from 'crypto';
import { PrismaService } from '../../config/prisma/prisma.service';

@Injectable()
export class EmailOtpService {
    constructor(private readonly prisma: PrismaService) {}

    async sendEmailOtp(toEmail: string): Promise<void> {
        const emailRegex = RegExp(/^\s*[\w-\. ]+@([\w-]+\.)+[\w-\s]+$/);

        if (!toEmail.match(emailRegex)) {
            return console.log('not match');
        }

        // console.log(process.env.EMAIL_SEND);
        const transporter = createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.EMAIL_SEND,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const OTP: string = crypto.randomInt(100000, 999999).toString();

        const mailOptions = {
            from: process.env.EMAIL_SEND,
            to: toEmail,
            subject: 'Email OTP Verification',
            html: emailTemplate(OTP, toEmail),
        };

        await transporter.sendMail(mailOptions);

        await this.prisma.emailOTP.create({
            data: {
                email: toEmail,
                OTP,
            },
        });
    }
}
