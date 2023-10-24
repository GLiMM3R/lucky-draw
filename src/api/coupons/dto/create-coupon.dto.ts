import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {
    @ApiProperty({
        description: 'The Id of the campaign',
    })
    campaignSlug: string;

    @ApiProperty({})
    name?: string;

    @ApiProperty({})
    phone?: string;
}
