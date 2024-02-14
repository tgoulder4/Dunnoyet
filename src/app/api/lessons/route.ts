'use server'
import getServerSession from 'next-auth';
import { auth } from "@/auth";
import { createLessonSchema } from "@/lib/validation/parseTypes";
import { NextRequest, NextResponse } from "next/server";

import { authConfig } from "@/auth.config";
export async function GET(req: NextRequest, res: NextResponse) {
    try {
        // const body = await req.json();
        // const parseResult = createLessonSchema.safeParse(body);
        // if (!parseResult.success) {
        //     return NextResponse.json({ error: parseResult.error.errors }, { status: 400 });
        // }
        // const lesson = parseResult.data;
        const sess = await getServerSession(
            authConfig,
        ).auth();
        if (!sess) return NextResponse.json({ error: "No session found - you aren't logged in so you can't create a lesson!" }, { status: 401 });
        console.log("sess: ", sess);
        return NextResponse.json({ message: sess }, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}