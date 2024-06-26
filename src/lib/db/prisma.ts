import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv/config'
const prismaClientSingleton = () => {
    return new PrismaClient();
}
const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
export default prisma;
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
export const prismaClient = prisma;