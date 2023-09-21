import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { PrismaModule } from '../../config/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LanguageModule } from '../../config/lang/language.module';

@Module({
    imports: [
        PrismaModule,
        UserModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
        }),
        LanguageModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService],
})
export class AuthModule {}
