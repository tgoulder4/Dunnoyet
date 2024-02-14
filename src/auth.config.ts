import type { NextAuthConfig } from "next-auth"

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
        // jwt: async ({ token, user, account, profile, isNewUser }) => {
        //     // Add access_token to the token right after signin
        //     if (account?.accessToken) {
        //         token.accessToken = account.accessToken
        //     }
        //     return Promise.resolve(token)
        // },
        // async session({ session, token, user }) {
        //     // `session` is the session object
        //     // `user` is the user object from the database (available when using database sessions)
        //     // You can add properties to the session object here

        //     session.user.id = user.id; // For example, adding the user's ID to the session
        //     session.expires = token.expires as Date & string; // Update session expiration to match token
        //     session.user.name = user.name; // Add the user's name to the session
        //     session.user.email = user.email; // Add the user's email to the session

        //     // You can also add other properties from the user object or even perform additional fetching here
        //     return session
        // },

        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isInUserArea = nextUrl.pathname.startsWith("/learn");
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
                return Response.redirect(new URL("/learn", nextUrl))
            };
            // console.log("Not logged in, and not user area. AUTHORISED")
            return true;
        }
    },
    providers: [

    ],
}