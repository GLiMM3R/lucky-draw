import { Body, Get, Delete, Query, Controller, Post, Patch, Param, UploadedFile, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { DrawPrizeService } from './draw-prize.service';
import { CreateDrawPrize } from './dto/create-draw-prize.dto';
import { UpdateDrawPrize } from './dto/update-draw-prize.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Draw Prizes API')
@Controller('draw-prizes')
export class DrawPrizeController {
    constructor(private readonly drawPrizeService: DrawPrizeService) {}

    @Get()
    @ApiQuery({
        name: 'drawId',
        type: String,
        required: false,
    })
    async getDrawPrizesbyDrawId(@Query('drawId') drawId?: string) {
        return await this.drawPrizeService.getDrawPrizes(drawId);
    }

    @Get('id=:id')
    async getDrawPrizeById(@Param('id') id: string) {
        return await this.drawPrizeService.getDrawPrizeById(id);
    }

    @Get('slug=:slug')
    async getDrawPrizeBySlug(@Param('slug') slug: string) {
        return await this.drawPrizeService.getDrawPrizesBySlug(slug);
    }

    @Get('slug=:slug/winners')
    async getWinnerDrawPrizeBySlug(@Param('slug') slug: string) {
        return await this.drawPrizeService.getWinnerDrawPrizesBySlug(slug);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async createDrawPrize(@Body() prizeData: CreateDrawPrize, @Req() request: Request, @UploadedFile() image?: Express.Multer.File) {
        return await this.drawPrizeService.createDrawPrize(prizeData, request, image);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async updateDrawPrize(@Param('id') id: string, @Body() prizeData: UpdateDrawPrize, @UploadedFile() image?: Express.Multer.File) {
        return await this.drawPrizeService.updateDrawPrize(id, prizeData, image);
    }

    @Delete(':id')
    async deleteDrawPrize(@Param('id') id: string) {
        return await this.drawPrizeService.deleteDrawPrize(id);
    }
}
