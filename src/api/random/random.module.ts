import { Module } from '@nestjs/common';
import { RandomService } from './random.service';
import { RandomController } from './random.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { LanguageModule } from 'src/config/lang/language.module';
import { CsvModule } from 'nest-csv-parser';

@Module({
    imports: [PrismaModule, LanguageModule, CsvModule],
    controllers: [RandomController],
    providers: [RandomService],
})
export class RandomModule {}
