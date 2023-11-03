import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateWheelPrize {
    @ApiProperty({
        description: 'The slug of campaign',
        type: String,
        required: false,
    })
    slug: string;

    @ApiProperty({
        description: 'The title of prize',
        type: String,
        example: 'Coupon 1,000,000 KIP',
        required: false,
    })
    @Transform(({ value }) => value.toLowerCase())
    title: string;

    @ApiProperty({
        description: 'The amount of prize',
        example: '3',
        required: false,
    })
    @Transform(({ value }) => Number(value))
    amount: number;

    @ApiProperty({ type: String, format: 'binary', required: false })
    image?: Express.Multer.File;

    @ApiProperty({
        required: false,
    })
    @Transform(({ value }) => Boolean(value))
    isComplete?: boolean;
}
