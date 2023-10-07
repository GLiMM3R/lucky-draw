import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { RandomService } from './random.service';
import { ApiTags } from '@nestjs/swagger';
import { RequestRandomDto } from './dto/request-random.dto';
import { RequestWheelDto } from './dto/request-wheel.dto';

@ApiTags('Random API')
@Controller('random')
export class RandomController {
    constructor(private readonly randomService: RandomService) {}

    @Post('lucky-draw')
    async randomDraw(@Body() randomData: RequestRandomDto) {
        return await this.randomService.randomDraw(randomData);
    }

    @Post('wheel-draw')
    async wheelDraw(@Body() randomData: RequestWheelDto) {
        return await this.randomService.wheelDraw(randomData);
    }
}
