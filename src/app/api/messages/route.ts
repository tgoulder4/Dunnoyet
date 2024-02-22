import { auth } from "@/auth";
import { decodeResponseSystemMessage, getSystemMessageForTeachingResponses } from "@/lib/chat/Eli/instructionsForRetrievingTypeOfTheirMessage";
import openai from "@/lib/chat/openai";
import { IChatMessage, IMessage } from "@/lib/validation/enforceTypes";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletion } from "openai/resources/index.mjs";

async function getTypeOfMessageTheyJustSent(messages: IChatMessage[]): Promise<'WHATCOMESTOMIND_FINALANSWER' | 'ENDOFTHREADQUESTION_FINALANSWER' | 'QUESTION' | 'RQ'> {
    try {

        const whatTheirResponseIs = await openai.chat.completions.create({
            messages: [decodeResponseSystemMessage, { role: "user", content: messages.map(m => m.role === "user" ? "Student: " : "Me: " + "Instruction1").join("\n") }],
            model: "gpt-3.5-turbo"
        })
        return whatTheirResponseIs.choices[0].message.content;
    }
    catch (e) {
        console.error(e);
    }
}
async function getNextMessage() {
    getSystemMessageForTeachingResponses('math', [{ point: 'addition', confidence: 0.9 }])
}
export async function POST(req: NextRequest) {
    const body = await req.json();
    const messages: IChatMessage[] = body.messages;
    const messagesTruncated = messages.slice(-6);
    const sess: Session | null = await auth()
    if (!sess) {
        return NextResponse.json({
            error: "You must be signed in to use this endpoint."
        }, { status: 401 })
    }
    const userID = sess.user?.id;
    const typeOfMessage = await getTypeOfMessageTheyJustSent();
    let nextMessage: IMessage = {} as IMessage;
    switch (typeOfMessage) {
        case 'WHATCOMESTOMIND_FINALANSWER':
            //check if it's true or get correction
            const trueOrCorrection = await checkIfTrueOrGetCorrection();
            if (trueOrCorrection === true) {
                //extract the knowledge points from the msg
                const knowledgePoint = await extractKnowledgePointFromMessage();
                //store the knowledge point in the database
                await storeKnowledgePointInDatabase();
                nextMessage = await getNextMessage()
            }
            return NextResponse.json({ typeOfMessage: 'WHATCOMESTOMIND_FINALANSWER' })
        case 'ENDOFTHREADQUESTION_FINALANSWER':
            return NextResponse.json({ typeOfMessage: 'ENDOFTHREADQUESTION_FINALANSWER' })
        case 'QUESTION':
            return NextResponse.json({ typeOfMessage: 'QUESTION' })
        case 'RQ':
            return NextResponse.json({ typeOfMessage: 'RQ' })
    }
    return nextMessage;
}
