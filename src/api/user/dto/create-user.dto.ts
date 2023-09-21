import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'The username of the user',
        type: String,
        example: 'John Doe',
    })
    @MaxLength(30)
    @MinLength(3)
    username: string;

    @ApiProperty({
        description: 'The password of the user',
        type: String,
        example: '12345678',
    })
    @MaxLength(30)
    @MinLength(8)
    password: string;
}
