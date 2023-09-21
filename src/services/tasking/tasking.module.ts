import { Module } from '@nestjs/common';
import { TaskingService } from './tasking.service';
import { PrismaModule } from '../../config/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [],
    providers: [TaskingService],
})
export class TaskingModule {}
