'use server'
import { AuthError } from "next-auth";
import { signIn } from "./auth"
import { ILesson, ITip } from "@/lib/validation/enforceTypes";
import { prismaClient } from "./lib/db/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = prismaClient;
export async function authenticate(prevState: string | undefined, formData: FormData) {
    console.dir("authenticate called, FormData:")
    console.dir(formData, { depth: null })
    try {
        await signIn("credentials", formData)
        console.log("returning 'Signing you in...'")
        return 'Signing you in...'
    }
    catch (err) {
        if (err instanceof AuthError) {
            switch (err.type) {
                case 'CredentialsSignin': return 'Invalid credentials';
                default: return 'An error occurred @authenticate';
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
        console.log("entered credentials: ", credentials);
        const parsedCredentials = z.object({ username: z.string(), password: z.string().min(6), email: z.string().email() }).safeParse(credentials);
        if (!parsedCredentials.success) return 'Server: Credentials didn\'t match the required format';

        //hash the password
        const hashedPassword = await bcrypt.hash(parsedCredentials.data.password, 10);
        const user = await prisma.user.create({
            data: {
                username: credentials.username as string,
                email: credentials.email as string,
                password: hashedPassword as string,
                tutorName: ''
            },
        });
        return 'User created!';
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
    const tips: ITip[] | null = await prisma.tip.findMany();
    return tips ? tips : [];
}
export async function getLessons(userID: string): Promise<ILesson[] | []> {
    console.log("getLessons called, userID: ", userID)
    const lessons = await prisma.lesson.findMany({
        where: {
            userId: userID
        },
    })
    console.log("lessons: ", lessons)
    return lessons
}