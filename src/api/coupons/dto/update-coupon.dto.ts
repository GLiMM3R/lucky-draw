import { ApiProperty } from '@nestjs/swagger';

export class UpdateCouponDto {
    @ApiProperty({})
    name?: string;

    @ApiProperty({})
    phone?: string;

    @ApiProperty()
    isNew: boolean;
}
