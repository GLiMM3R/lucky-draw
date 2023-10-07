import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../../config/prisma/prisma.module';
import { LanguageModule } from '../../config/lang/language.module';

@Module({
    imports: [PrismaModule, LanguageModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
