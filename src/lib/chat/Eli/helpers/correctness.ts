import { z } from "zod";
import openai from "../../openai";
import { messagesSchema } from "@/lib/validation/primitives";

export const checkIsUserRight = async (messageHistory: z.infer<typeof messagesSchema>[], subject?: string,)
    : Promise<boolean | null> => {
    try {
        const prompt = (subject ? 'We are teaching a student together about ' + subject + "." : '') + 'Given your knowledge and the chat history: "' + messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" + (m.content) + "'" : "Student: '" + m.content + "'").join('\n') + '\n" Is the student correct in their latest response? respond either TRUE or FALSE.'
        console.log("checkIsUserRight, prompt is " + prompt)
        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: prompt
            },],
            model: "gpt-3.5-turbo"
        })
        console.log("checkIsUserRight, response is " + JSON.stringify(res))
        if (res.choices[0].message.content == 'TRUE') return true;
        return false;
    }
    catch (e) {
        console.log("content of completion was null at howRightIsTheUser. Error:" + e);
        return null;
    }
}