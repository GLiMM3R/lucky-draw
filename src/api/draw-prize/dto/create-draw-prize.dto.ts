import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { MaxLength, MinLength } from 'class-validator';

export class CreateDrawPrize {
    @ApiProperty({
        description: 'The slug of campaign',
        type: String,
    })
    slug: string;

    @ApiProperty({
        description: 'The rank of prize',
        example: '3',
        type: Number,
    })
    @Transform(({ value }) => Number(value))
    rank: number;

    @ApiProperty({
        description: 'The title of prize',
        type: String,
        example: 'Coupon 1,000,000 KIP',
    })
    @MaxLength(30)
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
