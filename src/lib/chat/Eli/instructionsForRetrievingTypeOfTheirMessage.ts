import { IKnowledge, IMessage } from '@/lib/validation/enforceTypes';
import { ChatCompletionSystemMessageParam } from 'openai/resources/index.mjs';
import openai from '../openai';

// export const decodeResponseSystemMessage: ChatCompletionSystemMessageParam = {
//     role: "system",
//     content: "We are teaching a student together. I'll give you a chat history between me and the student. I have encoded instructions below, and will give you the code of the instruction to perform at the end of each of my messages here. Instruction1: Return either ‘WHATCOMESTOMIND_FINALANSWER’ if it’s their final answer to a ‘What comes to mind when...’ question. Return ‘ENDOFTHREADQUESTION_FINALANSWER’ if it’s their final answer to a question I asked to challenge their new knowledge. Return ‘QUESTION’ if they’re asking a question about information (non-question) that I gave them.'. Return 'RQ' If I asked them a question and they responded with a question - Their question may be a statement expressing confusion or an indirect question, both of which should return RQ."
// }
export const getTeachingResponse = (subject: string, rKs: IKnowledge[], messageHistory: IMessage[], theirInputWasFalse?: boolean) => openai.chat.completions.create({
    messages: [{
        role: 'system',
        content: `your name is Eli. you’re teaching a student named tye about` + subject + `. The answers you provide must contain EXACT TERMS from their related knowledge:` +
            rKs.map(rk => "Point:" + rk.pointInSolitude + ", Confidence: " + rk.confidence).join("\n\n") + ` and use the new knowledge points in their message given by 'RKSFROMLESSON:...' if applicable (should be prioritised). If you reference their knowledge, lazily wrap the areas you used it in with square brackets. Each sentence should be separated by a new line. Don't provide a summary or ask if they'd like to learn anything else. Form at least 5 sentences, and be kind. After answering 'what comes to mind', kindly respond in terms of this.`
    },
    ...messageHistory.slice(-6).map((m, index) => ({ role: m.role as 'user' | 'system', content: (m.content, (index === messageHistory.length - 1) ? theirInputWasFalse ? " This is wrong. Please correct them and remember to reference their related knowledge points." : "" : "") as string }))],
    model: "gpt-3.5-turbo"
})
//future function:
// export const getIsDetour = (messages: IMessage[]): Promise<boolean> => { }
//ALL UNTESTED FNS:
export const howRightIsTheUser = async (messageHistory: IMessage[], subject?: string,): Promise<'FULLY' | 'PARTLY' | 'NOT' | null> => {
    try {

        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: 'We are teaching a student together about ' + subject + '. Given your knowledge and the chat history: ' + messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" : "Student: '" + m.content + "'").join('\n') + '\n How right is the student? respond either "FULLY", "PARTLY", or if theyre completely and utterly wrong, respond "NOT".'
            },],
            model: "gpt-3.5-turbo"
        })
        return res.choices[0].message.content as 'FULLY' | 'PARTLY' | 'NOT';
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
export const getIsQuestion = async (subject: string, messageHistory: IMessage[]): Promise<boolean | null> => {
    try {

        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: 'We are teaching a student together about ' + subject + '. Given the chat history: ' + messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" : "Student: '" + m.content + "'").join('\n') + '\nIs their response a question? respond either TRUE or FALSE.'
            },],
            model: "gpt-3.5-turbo"
        })
        return res.choices[0].message.content === "TRUE"
    } catch (e) {
        console.log(e);
        return null;
    }
}
export const simplifyToKnowledgePoint = async (messageHistory: IMessage[], subject?: string) => {
    try {

        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: subject ? 'We are teaching a student together about ' + subject + '.' : '' + 'Given the chat history: ' + messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" : "Student: '" + m.content + "'").join('\n') + '\n Simplify their knowledge behind their reply to about 10 words which references the topic of the conversation. If it is partly correct, only focus on the correct parts. It should be comprehensible on its own.'
            },],
            model: "gpt-3.5-turbo"
        })
        return res.choices[0].message.content
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
// export const getSplitResponses = (askForSubject?: boolean, rKs: IKnowledge[], askForSubjectIntro?: boolean, userIsWrong?: boolean) => {