import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export async function generateUser() {
    await prisma.user.upsert({
        where: { username: 'jmart01' },
        update: {},
        create: {
            username: 'jmart01',
            password: await bcrypt.hash('jmart01', +process.env.SALT_ROUNDS),
        },
    });
    await prisma.user.upsert({
        where: { username: 'jmart02' },
        update: {},
        create: {
            username: 'jmart02',
            password: await bcrypt.hash('jmart02', +process.env.SALT_ROUNDS),
        },
    });
    await prisma.user.upsert({
        where: { username: 'jmart03' },
        update: {},
        create: {
            username: 'jmart03',
            password: await bcrypt.hash('jmart03', +process.env.SALT_ROUNDS),
        },
    });
    await prisma.user.upsert({
        where: { username: 'jmart04' },
        update: {},
        create: {
            username: 'jmart04',
            password: await bcrypt.hash('jmart04', +process.env.SALT_ROUNDS),
        },
    });
    await prisma.user.upsert({
        where: { username: 'jmart05' },
        update: {},
        create: {
            username: 'jmart05',
            password: await bcrypt.hash('jmart05', +process.env.SALT_ROUNDS),
        },
    });
}
// main()
//     .then(async () => {
//         await prisma.$disconnect();
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });
