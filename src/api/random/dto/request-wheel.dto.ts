import { ApiProperty } from '@nestjs/swagger';

export class RequestWheelDto {
    @ApiProperty({
        description: 'The id of campaign',
        type: String,
    })
    campaignId: string;

    @ApiProperty({})
    couponId: string;
}
