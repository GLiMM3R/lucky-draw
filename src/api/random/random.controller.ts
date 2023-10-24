import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RandomService } from './random.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestRandomDto } from './dto/request-random.dto';
import { RequestWheelDto } from './dto/request-wheel.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth()
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
