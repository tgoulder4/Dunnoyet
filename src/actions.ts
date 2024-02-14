'use server'
import { AuthError } from "next-auth";
import { signIn } from "./auth"
import { ITip } from "@/lib/validation/enforceTypes";
import { prismaClient } from "./lib/db/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = prismaClient;
export async function authenticate(prevState: string | undefined, formData: FormData) {
    console.dir("authenticate called, FormData:")
    console.dir(formData, { depth: null })
    try {
        await signIn("credentials", formData)
    }
    catch (err) {
        if (err instanceof AuthError) {
            switch (err.type) {
                case 'CredentialsSignin': return 'Invalid credentials';
                default: return 'An error occurred';
            }
        } else {
            throw err;
        }
    }
}
export async function createUser(prevState: string | undefined, formData: FormData) {
    try {
        //extract the credentials from the form data
        const credentials = Object.fromEntries(formData.entries());
        // const enteredUsername=credentials.
        console.log("credentials: ", credentials);
        return 'User created successfully';
        //validate the credentials
        // const parsedCredentials = z.object({ username: z.string(), password: z.string().min(6), email: z.string().email() }).safeParse(credentials);
        // if (!parsedCredentials.success) {
        //     console.error("Invalid credentials - couldn't create user. ", parsedCredentials.error);
        //     return null;
        // }
        // //hash the password
        // const hashedPassword = await bcrypt.hash(parsedCredentials.data.password, 10);
        // const user = await prisma.user.create({
        //     data: {
        //         username: _username.,
        //         email: credentials.email,
        //         password: hashedPassword,
        //         tutorName: ''
        //     },
        // });
        // return user;
    }
    catch (error) {
        console.error("Couldn't create the user. ", error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin': return 'Invalid credentials';
                default: return 'An error occurred';
            }
        } else {
            throw error;
        }
    }
}
export async function getTips(): Promise<ITip[] | [] | null> {
    const tips: ITip[] | null = await prisma.uIDetail.findFirst({
        select: {
            tips: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    link: true,
                    uiDetailId: true,
                }
            }
        }
    }).then(result => result?.tips || null)
    return tips ? tips : [];
}