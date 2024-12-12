import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
    try {
        await prisma.user.createMany({
            data: [
                {
                    username: 'admin',
                    password: 'admin',
                    roles: 'ADMIN',
                },
                {
                    username: 'user',
                    password: 'user',
                    roles: 'USER',
                },
                {
                    username: 'user2',
                    password: 'user2',
                    roles: 'USER',
                },
                {
                    username: 'user3',
                    password: 'user3',
                    roles: 'USER',
                },
            ],
        });
    } catch (error) {
        console.log('Error seeding users', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedUsers();
