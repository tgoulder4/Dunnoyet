'use server'
import { KPSchema, messagesSchema } from "@/lib/validation/primitives"
import { z } from "zod"
import openai, { getEmbedding } from "../../openai"
import { simplifyToKnowledgePointInSolitude } from "../helpers/simplify-message"
import { getTwoDCoOrdinatesOfKPInSolitude } from "@/components/UserArea/Learn/Lesson/Network/utils/helpers"
export async function getTeachingResponse(messageHistory: z.infer<typeof messagesSchema>[], targetQuestion?: string, subject?: string) {
    const prompt = `you directly continue my sentence making a point which makes sense on its own, starting with a lower case letter.
    ${subject ? "The subject is " + subject + "." : ""} ${targetQuestion ? 'the target question to answer is: ' + targetQuestion + '. Say the approx. number of messages we are away from answering this with each response, and always try and link back to this to get it answered quicker. your response is a short continuation of one large sentence. Say ‘END’ when it’s fully answered. directly continue your previous response. E.g. I say ‘electrons are negatively charged’, and you say ‘which means they repel each other 5’ (as we’re approx. 5 msgs away from lesson finish).'
            : ` there is never an end to the new information you tell me. when I say i understand, you extend the sentence further. Your reply should be like e.g. "which does x/this leads to Y,". dont re-iterate words in your responses. continue the never-ending sentence from there.`
        }. directly continue my sentence to add a single easy-to-understand knowledge point every response should be maximum 8 words.
            reply with one sentence. If they asked a question and say 'I understand' to your response, continue what you were saying prior. say nothing vague. be kind but never say 'great question' or 'good job'.
            `
    console.log("Prompt used: " + prompt + " appended with messageHistory: ", messageHistory.slice(-6).map((m, index) => ({ role: m.role == "eli" ? "system" : "user" as "user" | "system", content: m.content })))
    let res = await openai.chat.completions.create({
        messages: [{
            role: 'system',
            content: prompt
        },
        ...messageHistory.slice(-6).map((m, index) => ({ role: m.role == "eli" ? "system" : "user" as "user" | "system", content: m.content }))],
        model: "gpt-3.5-turbo"
    }).then(res => res.choices[0].message.content)
    console.log("res: ", res)
    if (!res) return null;
    //remove ending punctuation
    // //if there's a number at the end of the sentence, extract it
    // return res;
    // UNDO THIS TO RESTORE FUNCTIONALITY
    let number = res.match(/(\d+)$/)?.[0] || res.match(/\((\d+)\)$/)?.[1];
    if (number) {
        console.log("Distance found: ", number)
        res = res.slice(0, -number.length);
    }
    //if the text includes 'END' then make number = 1
    if (res.includes("END")) {
        number = "1";
        res = res.replace("END", "");
    }
    if (res.endsWith(".") || res.endsWith(",")) res = res.slice(0, -1);
    console.log("Sentence continuation: ", res)
    //parse the response HEREW
    const simplifiedKP = await simplifyToKnowledgePointInSolitude([...messageHistory, { role: 'eli', content: res } as any])
    if (!simplifiedKP) return null;
    const em = await getEmbedding(simplifiedKP);
    const TwoDvK = await getTwoDCoOrdinatesOfKPInSolitude([em]);
    const KP: z.infer<typeof KPSchema> = {
        confidence: 1,
        KP: simplifiedKP,
        TwoDvK
    }
    console.log("Returning teachingResponse", { role: 'eli', content: res, KP })
    return {
        role: 'eli',
        content: res,
        KP,
        eliResponseType: "General",
        distanceAwayFromFinishingLesson: number ? parseInt(number) : null
    } as z.infer<typeof messagesSchema>
}