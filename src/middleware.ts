import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;
export const config = {
    matcher: ["/((?!register|login|_next/static|_next/static/:path*|api|api/:path|next/image|_next/image/:path*|.*\\.png$).*)"]
}