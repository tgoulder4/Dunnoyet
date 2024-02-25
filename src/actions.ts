'use server'
import { AuthError } from "next-auth";
import { signIn } from "./auth"
import { ILesson, ITip, IUser } from "@/lib/validation/enforceTypes";
import { prismaClient } from "./lib/db/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";
var equal = require('deep-equal');
const prisma = prismaClient;
export async function getUser(userID?: string,
    choose?: {
        email?: boolean,
        username?: boolean,
        tutorName?: boolean,
        lessons?: boolean,
        knowledgePointsUnderstood?: boolean
    }
): Promise<IUser | null> {
    try {
        console.log("getUser (frontend,w/o password) called with userID: ", userID, " and choose: ", choose)
        const user = await prisma.user.findUnique({
            where: { id: userID },
            select: {
                id: true,
                email: true,
                tutorName: true,
                username: true,
                lessons: true,
                knowledgePoints: true
            },
        });
        if (!user) return null;
        console.log("User which getUser returned: ", user)
        return user;
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
                case 'CredentialsSignin': return 'Invalid credentials';
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
        const parsedCredentials = z.object({
            username: z.string(), password: z.string().min(6),
            confirmPassword: z.string().min(6),
            email: z.string().email()
        }).safeParse(credentials);
        if (!parsedCredentials.success) return 'Credentials didn\'t match the required format @createUser';
        const {
            username,
            password,
            confirmPassword,
            email
        } = parsedCredentials.data;

        if (password !== confirmPassword) return 'Passwords do not match';
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
                tutorName: '',
                knowledgePoints: {
                    create: undefined
                }
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
export async function getTips(): Promise<ITip[] | null> {
    console.log("getTips called")
    try {
        const tips: ITip[] | null = await prisma.tip.findMany();
        console.log("tips which getTips returned: ", tips)
        return tips;
    }
    catch (error) {
        console.error("Couldn't retrieve the tips. ", error);
        return null;
    }
}
export async function getLessons(userID: string): Promise<ILesson[]> {
    console.log("getLessons called, userID: ", userID)
    const lessons = await prisma.lesson.findMany({
        where: {
            userId: userID
        },
        select: {
            id: true,
            subjects: true,
            messages: true,
            beganAt: true,
            endedAt: true,
            knowledgePointChain: true,
            lessonStatus: true,
        }
    })
    console.log("lessons which getLessons returned: ", lessons)
    return lessons as ILesson[];
}