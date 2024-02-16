'use server'
import { AuthError } from "next-auth";
import { signIn } from "./auth"
import { ILesson, ITip, IUser } from "@/lib/validation/enforceTypes";
import { prismaClient } from "./lib/db/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = prismaClient;
export async function getUser(username: string): Promise<IUser | null> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username, // This matches the user with the provided email.
            },
        });
        if (!user) return null;
        return { ...user } as IUser;
    }
    catch (error) {
        console.error("Couldn't retrieve the user. ", error);
    }
    return null;
}
export async function authenticate(prevState: string | undefined, formData: FormData): Promise<string> {
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
                case 'CredentialsSignin': return 'Invalid credentials @authenticate';
                default: return 'An error occurred @authenticate';
            }
        } else {
            throw err;
        }
    }
}
async function checkDuplicateUser(username: string, email: string): Promise<false | 'email' | 'username'> {
    const duplicateUserByUsername = await prisma.user.findUnique({
        where: {
            username: username
        }
    });
    if (duplicateUserByUsername) return 'username';
    const duplicateUserByEmail = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (duplicateUserByEmail) return 'email';
    return false;
}
export async function createUser(prevState: string | undefined, formData: FormData) {
    try {
        //extract the credentials from the form data
        const credentials = Object.fromEntries(formData.entries());
        // const enteredUsername=credentials.
        console.log("entered credentials: ", credentials);
        const parsedCredentials = z.object({ username: z.string(), password: z.string().min(6), email: z.string().email() }).safeParse(credentials);
        if (!parsedCredentials.success) return 'Credentials didn\'t match the required format @createUser';

        //hash the password

        const duplicateUser = await checkDuplicateUser(parsedCredentials.data.username, parsedCredentials.data.email);
        if (duplicateUser) {
            return `A user with this ${duplicateUser} already exists.`
        }
        const hashedPassword = await bcrypt.hash(parsedCredentials.data.password, 10);
        await prisma.user.create({
            data: {
                username: credentials.username as string,
                email: credentials.email as string,
                password: hashedPassword as string,
                tutorName: ''
            },
        });
        console.log("User created successfully, ")
        return 'A link to verify your email has been sent to your email address!';
    }
    catch (error) {
        console.error("Couldn't create the user. ", error);
        if (error instanceof AuthError) {
            return error.message;
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