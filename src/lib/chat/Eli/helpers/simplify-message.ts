import { messagesSchema } from "@/lib/validation/primitives";
import openai from "../../openai";
import { z } from "zod";

export const simplifyToKnowledgePointInSolitude = async (messageHistory: z.infer<typeof messagesSchema>[], subject?: string): Promise<string | null> => {
    try {
        const prompt = 'Given the most recent chat history: ' + (messageHistory.slice(-2).map(m => m.role == "eli" ? "Assistant: '" + (m.content) + "'" : "Student: '" + m.content + "'").join('\n')) + '\n Simplify the knowledge behind the latest message to 10 words. Send one sentence only. It should be comprehensible on its own.'
        console.log("Simplify KP prompt: " + prompt)
        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: prompt
            },],
            model: "gpt-3.5-turbo"
        })
        const pointInSolitude = res.choices[0].message.content;
        console.log("PointInSolitude: " + pointInSolitude)
        if (pointInSolitude === null) throw new Error("simplifyToKnowledgePointInSolitude completion returned null, the completion failed.")
        if (pointInSolitude === "NULL") return null;
        return pointInSolitude as string;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
export const simplifyToSubject = async (statement: string): Promise<string | null> => {
    console.log("simplifyToSubject called")
    try {
        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: 'We are teaching a student together. Given the student said ' + statement + ', Simplify the subject of their reply to maximum 3 words which make sense on their own.'
            },],
            model: "gpt-3.5-turbo"
        })
        let subject = res.choices[0].message.content;
        if (!subject) {
            console.error("simplifyToSubject returned null, the completion failed.")
            return null;
        }
        //remove ending punctuation
        if (subject.endsWith(".") || subject.endsWith("?")) subject = subject.slice(0, -1)
        console.log("simplifyToSubject returned: " + res.choices[0].message.content)
        return subject
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
