import { Controller, Post, Get, Delete, Body, Req, Param, Patch, UseGuards, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Campaigns API')
@Controller('campaigns')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) {}

    @Get()
    @ApiQuery({
        name: 'type',
        type: String,
        required: false,
    })
    @ApiQuery({
        name: 'field',
        type: String,
        required: false,
    })
    @ApiQuery({
        name: 'status',
        type: String,
        required: false,
    })
    async getCampaigns(@Query('type') type?: string, @Query('field') field?: string | string[]) {
        return await this.campaignService.getCampaigns(type, field);
    }

    @Get('/validate')
    @ApiQuery({
        name: 'title',
        type: String,
        required: false,
    })
    async validateCampaign(@Query('title') title: string) {
        return await this.campaignService.validateCampaign(title);
    }

    @Get(':id')
    @ApiQuery({
        name: 'field',
        type: String,
        required: false,
    })
    async getCampaign(@Param('id') id: string) {
        return await this.campaignService.getCampaign(id);
    }

    @Get('/slug/:slug')
    @ApiQuery({
        name: 'field',
        type: String,
        required: false,
    })
    async getCampaignBySlug(@Param('slug') slug: string) {
        return await this.campaignService.getCampaignBySlug(slug);
    }

    @Post()
    async createCampaign(@Body() campaignData: CreateCampaignDto, @Req() request: Request) {
        return await this.campaignService.createCampaign(campaignData, request);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async updateCampaign(@Param('id') id: string, @Body() campaignData: UpdateCampaignDto) {
        return await this.campaignService.updateCampaign(id, campaignData);
    }

    @Patch('/dataset/:id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async updateDataset(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
        return await this.campaignService.updateDataset(id, file);
    }

    @Delete(':id')
    async removeCampaign(@Param('id') id: string) {
        return await this.campaignService.removeCampaign(id);
    }
}
