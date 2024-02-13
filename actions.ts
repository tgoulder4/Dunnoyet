'use server'
import { AuthError } from "next-auth";
import { signIn } from "./auth"

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