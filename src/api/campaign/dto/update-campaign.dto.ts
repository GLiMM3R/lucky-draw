import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength, Min } from 'class-validator';

export class UpdateCampaignDto {
    @ApiProperty({
        description: 'The title of campaign',
        example: 'Campaign end of year 2023',
        required: false,
    })
    @MaxLength(30)
    @MinLength(3)
    title: string;

    @ApiProperty({
        description: 'The maximum win amount per user',
        example: '3',
        required: false,
    })
    @Min(0)
    prizeCap: number;

    @ApiProperty({
        required: false,
    })
    isActive: boolean;

    @ApiProperty({ type: String, format: 'binary', required: false })
    file?: Express.Multer.File;
}
