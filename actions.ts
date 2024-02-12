'use server'
import { AuthError } from "next-auth";
import { signIn } from "./auth"

type FormData = {
    email: string;
    password: string;

}
export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn("credentials", formData)
    }
    catch (err) {
        if (err instanceof AuthError) {
            switch (err.type) {
                case 'CredentialsSignin': return 'Invalid credentials';
                default: return 'An error occurred';
            }
        }
        throw err;
    }
}