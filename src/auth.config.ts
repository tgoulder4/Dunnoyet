import type { NextAuthConfig } from "next-auth"
declare module "next-auth" {
    interface User {
        // Add your additional properties here:
        givenName?: string | null;
        preferLanguage?: string | null;
        role?: string;
    }
}
declare module "@auth/core/adapters" {
    interface AdapterUser {
        // Add your additional properties here:
        role: string | null;
        id: string;
        // preferLanguage: string | null;
    }
}
export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/register",
        error: "/auth/error",

    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.userId = user.id; // Assuming 'user.id' is the userID from your user model
                token.name = (trigger == "update" && session.name) ? session.name : user.name;
                token.email = user.email;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.userId) {
                // console.log("session.user: ", session.user)
                // console.log("token.userId: ", token.userId)
                session.user = {
                    id: token.userId as string, // Replace or extend the user object with the userId
                    name: token.name, // Retain existing session.user.name if necessary
                    email: token.email || "", // Retain existing session.user.email if necessary
                    role: token.role as string,
                    emailVerified: new Date()
                };
            }
            return session;
        },
        // session({ session, user }) {
        //     session.user.role = user.role,
        //         session.user.id = user.id
        //     return session
        // },

        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isInUserArea = nextUrl.pathname.startsWith("/home");

            // IN DEVELOPMENT, DISABLE THIS
            if (isInUserArea) {
                if (isLoggedIn) {
                    // console.log("Is logged in, and in user area. AUTHORISED")
                    return true
                };
                console.log("Not logged in, and in user area. Redirecting to /auth/login")
                return false;
            } else if (isLoggedIn) {
                // console.log("Is logged in, and not user area. REDIRECTING TO USER AREA")
                console.log("redirecitng to /learn")
                return Response.redirect(new URL("/home", nextUrl))
            };


            // console.log("Not logged in, and not user area. AUTHORISED")
            return true;
        }
    },
    //generate a jwt private key: openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
    //and for the encryption key, openssl rand -base64 32
    providers: [

    ],
}