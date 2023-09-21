import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({
        description: 'The username of the user',
        type: String,
    })
    username: string;

    @ApiProperty({
        description: 'The password of the user',
        type: String,
    })
    password: string;
}