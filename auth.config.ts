import type { NextAuthConfig } from "next-auth"
export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/signout",
        error: "/auth/error",

    },
    providers: [

    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnHomePage = nextUrl.pathname.startsWith("/learn");
            if (isOnHomePage) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn) {
                return Response.redirect(new URL("/learn", nextUrl))
            };
            return true;
        }
    }
}