import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Coupons API')
@Controller('coupons')
export class CouponsController {
    constructor(private readonly couponsService: CouponsService) {}

    @Post()
    async createPrize(@Body() couponData: CreateCouponDto, @Req() request: Request) {
        return await this.couponsService.createCoupon(couponData, request);
    }

    @Get()
    @ApiQuery({
        name: 'campaignId',
        required: false,
    })
    async getCoupons(@Query('campaignId') campaignId: string) {
        return await this.couponsService.getCoupons(campaignId);
    }

    @Get(':id')
    async getCoupon(@Param('id') id: string) {
        return await this.couponsService.getCoupon(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
        return this.couponsService.updateCoupon(id, updateCouponDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.couponsService.removeCoupon(id);
    }
}
