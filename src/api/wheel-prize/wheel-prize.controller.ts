import { Body, Get, Delete, Controller, Post, Patch, Param, UploadedFile, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '../../guard/auth.guard';
import { WheelPrizeService } from './wheel-prize.service';
import { CreateWheelPrize } from './dto/create-wheel-prize.dto';
import { UpdateWheelPrize } from './dto/update-wheel-prize.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Wheel Prizes API')
@Controller('wheel-prizes')
export class WheelPrizeController {
    constructor(private readonly wheelPrizeService: WheelPrizeService) {}

    @Get()
    async getWheelPrizes(@Req() request: Request) {
        return await this.wheelPrizeService.getWheelPrizes(request);
    }

    @Get('id=:id')
    async getWheelPrizeById(@Param('id') id: string, @Req() request: Request) {
        return await this.wheelPrizeService.getWheelPrizeById(id, request);
    }

    @Get('slug=:slug')
    async getWheelPrizeBySlug(@Param('slug') slug: string, @Req() request: Request) {
        return await this.wheelPrizeService.getWheelPrizeBySlug(slug, request);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async createWheelPrize(@Body() prizeData: CreateWheelPrize, @Req() request: Request, @UploadedFile() image?: Express.Multer.File) {
        return await this.wheelPrizeService.createWheelPrize(prizeData, request, image);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async updateRandomPrize(
        @Param('id') id: string,
        @Body() prizeData: UpdateWheelPrize,
        @Req() request: Request,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        return await this.wheelPrizeService.updateWheelPrize(id, prizeData, request, image);
    }

    @Delete(':id')
    async deleteRandomPrize(@Param('id') id: string, @Req() request: Request) {
        return await this.wheelPrizeService.deleteWheelPrize(id, request);
    }
}
