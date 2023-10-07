import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/response-auth.dto';
import { Request } from 'express';

// NOTE - This is the interface for the token that will be returned to the user
export interface IToken {
    access_token: string;
    refresh_token: string;
}
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async signUp(signUpAuthDto: CreateUserDto): Promise<void> {
        await this.usersService.create(signUpAuthDto);
    }

    async signIn(username: string, pass: string): Promise<IToken> {
        const user = await this.usersService.findOneByUsername(username, pass);

        const payload = {
            username: user.username,
            sub: { id: user.id },
        };

        const access_token = await this.getJwtToken(payload);
        const refresh_token = await this.getJwtRefreshToken(payload);

        return {
            access_token,
            refresh_token,
        };
    }

    async refreshToken(request: Request): Promise<AuthResponseDto> {
        const { sub } = request['user'];

        // NOTE - This is where you would check the user's credentials
        const user = await this.usersService.getUser(sub.id);

        const payload = {
            username: user.username,
            sub: {
                id: user.id,
            },
        };
        const access_token = await this.getJwtToken(payload);
        const refresh_token = await this.getJwtRefreshToken(payload);

        return {
            access_token,
            refresh_token,
        };
    }

    async getJwtToken(payload: any) {
        const secret = process.env.JWT_SECRET;
        const expiresIn = process.env.JWT_EXPIRATION_TIME;

        const token = await this.jwtService.signAsync(payload, {
            expiresIn,
            secret,
        });

        return token;
    }

    async getJwtRefreshToken(payload: any) {
        const secret = process.env.JWT_REFRESH_TOKEN_SECRET;

        const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME;
        const token = await this.jwtService.signAsync(payload, {
            expiresIn,
            secret,
        });

        return token;
    }
}
