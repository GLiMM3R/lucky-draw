import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../config/prisma/prisma.module';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
    imports: [PrismaModule, JwtModule],
    providers: [AuthGuard, RolesGuard],
})
export class GuardModule {}
