import { User } from '@prisma/client';

export class ResponseUserDto {
    id: string;
    username: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.isActive = user.isActive;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}
