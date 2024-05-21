'use server'
import { KPSchema, messagesSchema } from "@/lib/validation/primitives"
import { z } from "zod"
import openai, { getEmbedding } from "../../openai"
import { simplifyToKnowledgePointInSolitude } from "../helpers/simplify-message"
import { getTwoDCoOrdinatesOfKPInSolitude } from "@/components/UserArea/Learn/Lesson/Network/utils/helpers"

export async function getTeachingResponse(messageHistory: z.infer<typeof messagesSchema>[], rKPs: string[], targetQuestion?: string) {
    const res = await openai.chat.completions.create({
        messages: [{
            role: 'system',
            content:
                `your name is Eli and you’re teaching a student who has knowledge of ${rKPs.slice(-6).map((rKP, i) => i + ". " + rKP).join(",")}.
        ${targetQuestion ? 'the target question to answer is: ' + targetQuestion + '. Say the approx. number of messages we are away from answering this with each response, and always try and link back to this to get it answered quicker. Say ‘END’ when it’s fully answered. directly continue your previous response. E.g. I say ‘electrons are negatively charged’, and you say ‘which means they repel each other 5’ (as we’re approx. 5 msgs away from lesson finish).'
                    : ' there is never an end to the new information you tell me. when I say "i understand", you extend the sentence further, e.g. "which does x/this leads to Y," (without the full-stop). If I ask a question you pivot to responding to that. dont re-iterate words in your responses. when I ask a question, ask a question asking what I know to ease me into more complex answers. continue the never-ending sentence from there.'
                }. directly continue my sentence to add a single easy-to-understand knowledge point every response should be maximum 8 words. Should never contain a full stop as the sentence is never-ending. IMPORTANT: Use their knowledge in your answer. say which number you used by adding ‘USED N’ where N is the knowledge number.
                reply with one sentence. If they asked a question and say 'I understand' to your response, continue what you were saying prior. say nothing vague. research every answer you give to ensure it's factual. scite your every fact. you should be asking me questions first to understand what i know then saying your answer in terms of it.
                `
        },
        ...messageHistory.slice(-6).map((m, index) => ({ role: m.role as 'user' | 'system', content: m.content }))],
        model: "gpt-3.5-turbo"
    }).then(res => res.choices[0].message.content)
    if (!res) return null;
    //parse the response
    const simplifiedKP = await simplifyToKnowledgePointInSolitude([...messageHistory, { role: 'eli', content: res } as any])
    if (!simplifiedKP) return null;
    const em = await getEmbedding(simplifiedKP);
    const TwoDvK = await getTwoDCoOrdinatesOfKPInSolitude([em])
    const KP: z.infer<typeof KPSchema> = {
        confidence: 1,
        point: simplifiedKP,
        TwoDvK
    }
    return {
        role: 'eli',
        content: res,
        KP
    } as z.infer<typeof messagesSchema>
}