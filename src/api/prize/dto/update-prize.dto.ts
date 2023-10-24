import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength, Min } from 'class-validator';

export class UpdatePrizeDto {
    @ApiProperty({
        description: 'The slug of campaign',
        type: String,
        required: false,
    })
    campaignSlug: string;

    @ApiProperty({
        description: 'The title of prize',
        type: String,
        example: 'Coupon 1,000,000 KIP',
        required: false,
    })
    @MaxLength(30)
    @MinLength(3)
    title: string;

    @ApiProperty({
        description: 'The amount of prize',
        example: '3',
        required: false,
    })
    @Min(0)
    amount: number;

    @ApiProperty({
        description: 'The rank of prize',
        example: '3',
        required: false,
    })
    @Min(0)
    rank: number;

    @ApiProperty({ type: String, format: 'binary', required: false })
    image?: Express.Multer.File;

    @ApiProperty({
        required: false,
    })
    isActive?: boolean;
}
