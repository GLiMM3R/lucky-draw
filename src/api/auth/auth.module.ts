import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { PrismaModule } from '../../config/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LanguageModule } from '../../config/lang/language.module';
import { LoggerService } from '../../services/logger/logger.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
        }),
        PrismaModule,
        UserModule,
        LanguageModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, LoggerService],
})
export class AuthModule {}
