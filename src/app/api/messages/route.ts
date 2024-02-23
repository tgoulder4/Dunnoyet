import { auth } from "@/auth";
import { getNextMessage } from "@/lib/chat/Eli/eli";
import { decodeResponseSystemMessage, getSystemMessageForTeachingResponses } from "@/lib/chat/Eli/instructionsForRetrievingTypeOfTheirMessage";
import openai from "@/lib/chat/openai";
import { IChatMessage, IMessage, IMessagesEndpointResponsePayload, IMessagesEndpointSendPayload } from "@/lib/validation/enforceTypes";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletion } from "openai/resources/index.mjs";
export async function POST(req: NextRequest) {
    const sess: Session | null = await auth()
    if (!sess) return NextResponse.unauthorized("Unauthorized")
    const body = await req.json();
    const messages: IMessagesEndpointSendPayload = body.messages;
    const res: IMessagesEndpointResponsePayload = await getNextMessage(messages);
}
