import { ApiProperty } from '@nestjs/swagger';

export class CreateWinnerRecordDto {
    @ApiProperty({
        description: 'The id of campaign',
        type: String,
    })
    campaignId: string;

    @ApiProperty({
        description: 'The id of prize',
    })
    prizeId: string;

    @ApiProperty({
        description: 'Winner name',
    })
    winnerName: string;

    @ApiProperty({
        description: 'The phone number',
    })
    winnerPhone: string;
}
