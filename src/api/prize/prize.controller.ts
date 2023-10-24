import { Body, Get, Delete, Query, Controller, Post, Patch, Param, UploadedFile, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { PrizeService } from './prize.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { UpdatePrizeDto } from './dto/update-prize.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Prizes API')
@Controller('prizes')
export class PrizeController {
    constructor(private readonly prizeService: PrizeService) {}

    @Get()
    @ApiQuery({
        name: 'campaignId',
        type: String,
        required: false,
    })
    async getPrizes(@Query('campaignId') campaignId?: string) {
        return await this.prizeService.getPrizes(campaignId);
    }

    @Get(':id')
    async getPrize(@Param('id') id: string) {
        return await this.prizeService.getPrize(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async createPrize(@Body() prizeData: CreatePrizeDto, @Req() request: Request, @UploadedFile() image?: Express.Multer.File) {
        return await this.prizeService.createPrize(prizeData, request, image);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async updatePrize(@Param('id') id: string, @Body() prizeData: UpdatePrizeDto, @UploadedFile() image?: Express.Multer.File) {
        return await this.prizeService.updatePrize(id, prizeData, image);
    }

    @Delete(':id')
    async deletePrize(@Param('id') id: string) {
        return await this.prizeService.deletePrize(id);
    }
}
