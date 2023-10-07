import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { LanguageModule } from 'src/config/lang/language.module';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { FileUploadModule } from 'src/services/file-upload/file-upload.module';

@Module({
    imports: [PrismaModule, FileUploadModule, LanguageModule],
    controllers: [CouponsController],
    providers: [CouponsService],
})
export class CouponsModule {}
