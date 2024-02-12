import { IUser } from '@/lib/types';
import { authConfig } from './auth.config';
import NextAuth from "next-auth";
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function getUser(email: string): Promise<IUser | null> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email, // This matches the user with the provided email.
            },
        });
        return user as IUser;
    }
    catch (error) {
        console.error("Couldn't retrieve the user. ", error);
    }
    return null;
}
export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
                }
                console.log("Credentials are invalid.");
                return null;

            }
        })
    ]
})