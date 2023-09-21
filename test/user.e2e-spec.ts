import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { CreateUserDto } from 'src/api/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/api/user/dto/update-user.dto';

describe('UserController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    let userId: any;
    const userCreateDto = {
        username: 'test', // username must be at least 3 characters
        password: '12345678', // password must be at least 8 characters
    } as CreateUserDto;

    const userUpdateDto = {
        username: 'test updated',
    } as UpdateUserDto;

    test('/users (GET)', async () => {
        const response = await request(app.getHttpServer()).get('/users').expect(200);
        expect(response.body).toBeInstanceOf(Array);

        return response;
    });

    test('/users (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/users/')
            .send({
                username: userCreateDto.username,
                password: userCreateDto.password,
            })
            .expect(201);

        userId = response.body.id;
        return response;
    });

    test('/users/:id (GET)', async () => {
        return await request(app.getHttpServer()).get(`/users/${userId}`).expect(200);
    });

    test('/users/:id (PATCH)', async () => {
        const updated = await request(app.getHttpServer())
            .patch(`/users/${userId}`)
            .send({
                username: userUpdateDto.username,
            })
            .expect(200);

        userId = updated.body.id;

        return updated;
    });

    test('/users/:id (DELETE)', async () => {
        return await request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);
    });
});
