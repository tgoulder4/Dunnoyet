'use server'
import { IUser } from '@/lib/validation/enforceTypes';
import { authConfig } from './auth.config';
import NextAuth from "next-auth";
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from "bcrypt";
import { prismaClient } from './lib/db/prisma';

const prisma = prismaClient;
export async function getUser(username: string): Promise<IUser | null> {
    console.log("getUser (server) called with username: ", username)
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username, // This matches the user with the provided email.
            },
        });
        if (!user) return null;
        return user as IUser;
    }
    catch (error) {
        console.error("Couldn't retrieve the user - auth.ts ", error);
    }
    return null;
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    basePath: '/auth',
    providers: [
        Credentials({
            name: 'credentials',
            async authorize(credentials) {
                console.log("authorize called with credentials: ", credentials)
                const parsedCredentials = z.object({ username: z.string(), password: z.string().min(6) })
                    .safeParse(credentials);
                console.log("parsedCredentials: ", parsedCredentials)
                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;
                    const user = await getUser(username);

                    console.log("user: ", user)
                    if (!user) {
                        console.log("User not found.")
                        return null
                    };
                    const passwordsMatch = await bcrypt.compare(password, user.password!!);
                    if (passwordsMatch) {
                        console.log("Credentials are valid, returning user.", user)
                        return user;
                    } else {
                        console.log("Passwords didn't match. Entered:[", password, "]", " Stored:[", user.password, "]")
                    }
                }
                return null;

            }
        })
    ]
})