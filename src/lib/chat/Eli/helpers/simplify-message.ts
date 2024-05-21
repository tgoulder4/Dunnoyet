import { messagesSchema } from "@/lib/validation/primitives";
import openai from "../../openai";
import { z } from "zod";

export const simplifyToKnowledgePointInSolitude = async (messageHistory: z.infer<typeof messagesSchema>[], subject?: string): Promise<string | null> => {
    try {
        const prompt = 'Given the most recent chat history: ' + (messageHistory.slice(-2).map(m => m.role == "eli" ? "Assistant: '" + (m.content) + "'" : "Student: '" + m.content + "'").join('\n')) + '\n Simplify the knowledge behind the latest message to 10 words. Send one sentence only. It should be comprehensible on its own.'
        console.log("\n [CALL] SIMPLIFY_TO_KP, prompt: " + prompt)
        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: prompt
            },],
            model: "gpt-3.5-turbo"
        })
        const pointInSolitude = res.choices[0].message.content;
        console.log("\n FROM SIMPLIFY_TO_KP: " + pointInSolitude, " \nif this is 'NULL', they didn't have any knowledge to extract.")
        if (pointInSolitude === null) throw new Error("simplifyToKnowledgePointInSolitude completion returned null, the completion failed.")
        if (pointInSolitude === "NULL") return null;
        return pointInSolitude as string;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
export const simplifyToSubject = async (messageHistory: z.infer<typeof messagesSchema>[]): Promise<string | null> => {
    console.log("simplifyToSubject called")
    try {
        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: 'We are teaching a student together. Given the chat history: ' + (messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" + (m.content) + "'" : "Student: '" + m.content + "'").join('\n')) + '\n Simplify the subject of their reply to maximum 3 words which make sense on their own.'
            },],
            model: "gpt-3.5-turbo"
        })
        console.log("simplifyToSubject returned: " + res.choices[0].message.content)
        return res.choices[0].message.content
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
