import { messagesSchema } from "@/lib/validation/primitives";
import openai from "../../openai";
import { z } from "zod";

export const getIsQuestion = async (subject: string, messageHistory: z.infer<typeof messagesSchema>[]): Promise<boolean | null> => {
    try {

        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: 'We are teaching a student together about ' + subject + '. Given the chat history: ' + messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" + (m.content) + "'" : "Student: '" + m.content + "'").join('\n') + '\nIs their response a question? respond either TRUE or FALSE.'
            },],
            model: "gpt-3.5-turbo"
        })
        return res.choices[0].message.content === "TRUE"
    } catch (e) {
        console.log(e);
        return null;
    }
}