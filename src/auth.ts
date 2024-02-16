'use server'
import { IUser } from '@/lib/validation/enforceTypes';
import { authConfig } from './auth.config';
import NextAuth from "next-auth";
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getUser } from './actions';


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
                    const user: IUser | null = await getUser(username);
                    console.log("user: ", user)
                    if (!user) {
                        console.log("User not found.")
                        return null
                    };
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) {
                        console.log("Credentials are valid, returning user.", user)
                        return user;
                    }
                }
                return null;

            }
        })
    ]
})