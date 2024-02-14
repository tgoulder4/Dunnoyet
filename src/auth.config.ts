import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/register",
        error: "/auth/error",
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
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
                console.log("redirecitng to /learn", nextUrl)
                return Response.redirect(new URL("/learn", nextUrl))
            };
            // console.log("Not logged in, and not user area. AUTHORISED")
            return true;
        }
    },
    providers: [

    ],
}