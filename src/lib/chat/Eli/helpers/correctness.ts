import { z } from "zod";
import openai from "../../openai";
import { messagesSchema } from "@/lib/validation/primitives";

export const howRightIsTheUser = async (messageHistory: z.infer<typeof messagesSchema>[], subject?: string,)
    : Promise<'FULLY' | 'PARTLY' | 'NOT' | null> => {
    try {
        const prompt = (subject ? 'We are teaching a student together about ' + subject + "." : '') + 'Given your knowledge and the chat history: "' + messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" + (m.content) + "'" : "Student: '" + m.content + "'").join('\n') + '\n" How right is the student in their latest response? respond either "FULLY" if theyre fully right, respond "PARTLY" if theyre partly right, if theyre completely wrong respond "NOT".'
        console.log("HowRightIsTheUserCalled, prompt is " + prompt)
        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: prompt
            },],
            model: "gpt-3.5-turbo"
        })
        return res.choices[0].message.content as 'FULLY' | 'PARTLY' | 'NOT';
    }
    catch (e) {
        console.log("content of completion was null at howRightIsTheUser. Error:" + e);
        return null;
    }
}