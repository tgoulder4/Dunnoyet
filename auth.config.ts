import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/register",
        error: "/auth/error",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isInUserArea = nextUrl.pathname.startsWith("/learn");
            if (isInUserArea) {
                if (isLoggedIn) {
                    // console.log("Is logged in, and in user area. AUTHORISED")
                    return true
                };
                console.log("Not logged in, and in user area. REDIRECTING TO LOGIN")
                return false;
            } else if (isLoggedIn) {
                // console.log("Is logged in, and not user area. REDIRECTING TO USER AREA")
                return Response.redirect(new URL("/learn", nextUrl))
            };
            // console.log("Not logged in, and not user area. AUTHORISED")
            return true;
        }
    },
    providers: [

    ],
}