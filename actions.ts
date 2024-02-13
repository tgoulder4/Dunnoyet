'use server'
import { AuthError } from "next-auth";
import { signIn } from "./auth"

export async function authenticate(prevState: string | undefined, formData: FormData) {
    console.log("authenticate called with", { prevState, formData })
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