import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { MinLength } from 'class-validator';

export class CreateWheelPrize {
    @ApiProperty({
        description: 'The slug of campaign',
        type: String,
    })
    slug: string;

    @ApiProperty({
        description: 'The title of prize',
        type: String,
        example: 'Coupon 1,000,000 KIP',
    })
    @MinLength(3)
    @Transform(({ value }) => value.toLowerCase())
    title: string;

    @ApiProperty({
        description: 'The amount of prize',
        example: '3',
    })
    @Transform(({ value }) => Number(value))
    amount: number;

    @ApiProperty({ type: String, format: 'binary', required: false })
    image?: Express.Multer.File;
}
