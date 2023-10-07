import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class CreatePrizeDto {
    @ApiProperty({
        description: 'The id of campaign',
        type: String,
    })
    campaignId: string;

    @ApiProperty({
        description: 'The title of prize',
        type: String,
        example: 'Coupon 1,000,000 KIP',
    })
    @MaxLength(30)
    @MinLength(3)
    title: string;

    @ApiProperty({
        description: 'The amount of prize',
        example: '3',
    })
    amount: number;

    @ApiProperty({
        description: 'The rank of prize',
        example: '3',
        type: Number,
    })
    rank: number;

    @ApiProperty({ type: String, format: 'binary', required: false })
    image?: Express.Multer.File;
}
