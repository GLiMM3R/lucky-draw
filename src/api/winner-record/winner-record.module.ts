import { Module } from '@nestjs/common';
import { WinnerRecordService } from './winner-record.service';
import { WinnerRecordController } from './winner-record.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [WinnerRecordController],
    providers: [WinnerRecordService],
})
export class WinnerRecordModule {}
