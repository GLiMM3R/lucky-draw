import { Body, Get, Delete, Query, Controller, Post, Patch, Param, UploadedFile, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '../../guard/auth.guard';
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
    async getDrawPrizesbyDrawId(@Query('drawId') drawId?: string, @Req() request?: Request) {
        return await this.drawPrizeService.getDrawPrizes(drawId, request);
    }

    @Get('id=:id')
    async getDrawPrizeById(@Param('id') id: string, @Req() request: Request) {
        return await this.drawPrizeService.getDrawPrizeById(id, request);
    }

    @Get('slug=:slug')
    async getDrawPrizeBySlug(@Param('slug') slug: string, @Req() request: Request) {
        return await this.drawPrizeService.getDrawPrizesBySlug(slug, request);
    }

    @Get('slug=:slug/winners')
    async getWinnerDrawPrizeBySlug(@Param('slug') slug: string, @Req() request: Request) {
        return await this.drawPrizeService.getWinnerDrawPrizesBySlug(slug, request);
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
    async updateDrawPrize(
        @Param('id') id: string,
        @Body() prizeData: UpdateDrawPrize,
        @UploadedFile() image?: Express.Multer.File,
        @Req() request?: Request,
    ) {
        return await this.drawPrizeService.updateDrawPrize(id, prizeData, image, request);
    }

    @Delete(':id')
    async deleteDrawPrize(@Param('id') id: string, @Req() request: Request) {
        return await this.drawPrizeService.deleteDrawPrize(id, request);
    }
}
