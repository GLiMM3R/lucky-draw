import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/response-auth.dto';

// NOTE - This is the interface for the token that will be returned to the user
export interface IToken {
    access_token: string;
    refresh_token: string;
}
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {}

    async signUp(signUpAuthDto: CreateUserDto): Promise<void> {
        await this.usersService.create(signUpAuthDto);
        // await this.emailOtpService.sendEmailOtp(signUpAuthDto.username);
    }

    async signIn(username: string, pass: string): Promise<IToken> {
        // NOTE - This is where you would check the user's credentials
        const user = await this.usersService.findOneByUsername(username, pass);

        const payload = {
            username: user.username,
            sub: { user: user.id, roles: user.roles },
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: await this.jwtService.signAsync(payload, {
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
                secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            }),
        };
    }

    async refreshToken(token: any): Promise<AuthResponseDto> {
        const payload = {
            username: token.username,
            sub: { user: token.sub.user, roles: token.sub.roles },
        };

        // NOTE - This is where you would check the user's credentials
        await this.usersService.findOneByUsername(payload.username);

        return {
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: await this.jwtService.signAsync(payload, {
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
                secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            }),
        };
    }
}
