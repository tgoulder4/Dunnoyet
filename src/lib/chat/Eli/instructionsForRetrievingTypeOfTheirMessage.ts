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
export const howRightIsTheUser = async (messageHistory: IMessage[], subject?: string,)
    : Promise<'FULLY' | 'PARTLY' | 'NOT' | null> => {
    try {
        const prompt = subject ? 'We are teaching a student together about ' + subject + "." : '' + 'Given your knowledge and the chat history: "' + messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" + m.content + "'" : "Student: '" + m.content + "'").join('\n') + '\n" How right is the student in their latest response? respond either "FULLY" if theyre fully right, respond "PARTLY" if theyre partly right, and if theyre completely wrong, respond "NOT". if they dont say any anything that shows what they know, say NOT.'
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
export const getIsQuestion = async (subject: string, messageHistory: IMessage[]): Promise<boolean | null> => {
    try {

        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: 'We are teaching a student together about ' + subject + '. Given the chat history: ' + messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" + m.content + "'" : "Student: '" + m.content + "'").join('\n') + '\nIs their response a question? respond either TRUE or FALSE.'
            },],
            model: "gpt-3.5-turbo"
        })
        return res.choices[0].message.content === "TRUE"
    } catch (e) {
        console.log(e);
        return null;
    }
}
//FAILING
// export const getIsQuestionResponseTrueOrFalse = async (messageHistory: IMessage[]): Promise<boolean | null> => {

//     try {
//         const prompt = 'We are teaching a student together. Given the chat history: ' + messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" + m.content + "'" : "Student: '" + m.content + "'").join('\n') + '\n Is the students response to the question correct or not? Respond either TRUE or FALSE.'
//         console.log("getIsQuestionResponseTrueOrFalse called, prompt is: " + prompt)
//         const res = await openai.chat.completions.create({
//             messages: [{
//                 role: 'system',
//                 content: prompt
//             },],
//             model: "gpt-3.5-turbo"
//         })
//         const result = res.choices[0].message.content;
//         if (result === null) throw new Error("getIsQuestionResponseTrueOrFalse returned null, the completion failed.")
//         console.log("getIsQuestionResponseTrueOrFalse returned: " + result)
//         return result === "TRUE" || result == "true"
//     } catch (e) {
//         console.log("Error in getIsQuestionResponseTrueOrFalse: " + e);
//         return null;
//     }
// }
export const simplifyToKnowledgePoint = async (messageHistory: IMessage[], subject?: string): Promise<string | null | undefined> => {
    try {
        const prompt = subject ? 'We are teaching a student together about ' + subject + '.' : '' + 'Given the chat history: ' + messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" + m.content + "'" : "Student: '" + m.content + "'").join('\n') + '\n Simplify their knowledge behind their reply to about 10 words which references the topic of the conversation. It should only include information in their last reply, in exact terms, anything else you add must be to make the result more explicit, with the topic written first then the rest after. It mustnt be vague or general at all, say it with no room for confusion. Send one sentence only. If it is partly correct, only focus on the correct parts. It should be comprehensible on its own. If there is no extractable knowledge, say NULL.'

        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: prompt
            },],
            model: "gpt-3.5-turbo"
        })
        const pointInSolitude = res.choices[0].message.content;
        console.log("SimplifyToKnowledgePoint returned: " + pointInSolitude)
        if (pointInSolitude == null) throw new Error("simplifyToKnowledgePoint completion returned null, the completion failed.")
        if (pointInSolitude === "NULL") return null;
        return pointInSolitude as string;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
}
// export const getChallengeQuestion = async (subject: string, messageHistory: IMessage[]): Promise<string | null> => {
//     //given what they've learnt about SUBJECT, and the message history MESSAGEHISTORY, quiz them on a question about the subject.
//     try {
//         const res = await openai.chat.completions.create({
//             messages: [{
//                 role: 'system',
//                 content: 'Given what this student has learnt about ' + subject + ' from the chat history: ' + messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" : "Student: '" + m.content + "'").join('\n') + '\n Ask them a question about the subject. Say the question only and nothing else.'
//             },],
//             model: "gpt-3.5-turbo"
//         })
//         return res.choices[0].message.content
//     } catch (e) {
//         console.log(e);
//         return null;
//     }
// }
export const getSplitResponses = async (messages: IMessage[], rKs?: Array<{ pointInSolitude: string, confidence: number }>, subject?: string, askForSubject?: boolean, askForSubjectIntro?: boolean, userIsWrong?: boolean, splitResponsesLimit?: number)
    : Promise<{ splitResponses: IMessage[], subject?: string, subjectIntro?: string } | null> => {
    try {
        if (!rKs) throw new Error("rKs is null in getSplitResponses. Eli can't reply in terms of their knowledge without related knowledge points.");
        const prompt = `your name is Eli.` + subject ? ` you’re teaching a student named tye about` + subject : "" + `. The answers you provide must contain EXACT TERMS from their related knowledge:` + rKs.map(rk => "Point:" + rk.pointInSolitude + ", Confidence: " + rk.confidence).join("\n\n") + '. Reply to their latest response in these messages: ' + messages.map(msg => msg.role + ": " + msg.content).join('\n') +
            `If you reference their knowledge, lazily wrap the areas you used it in with square brackets. Each sentence should be separated by a new line. Don't provide a summary or ask if they'd like to learn anything else. Form at most` + splitResponsesLimit ? splitResponsesLimit : '5' + ` sentences, and be kind. After answering 'what comes to mind', kindly respond in terms of this.`
                + askForSubject || askForSubjectIntro ? ' Put MAIN: around your reply. ' : '' + askForSubject ? 'After your response, put "SUBJECT: " and then the subject of the conversation.' : '' + askForSubjectIntro ? 'After your response, put "SUBJECTINTRO: " and then a brief introduction saying the subject of the conversation changed to (that subject) as it is closest to their current knowledge.' : '' + userIsWrong ? ' Their response is wrong. Please correct them and remember to reference their related knowledge points.' : ''
        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: prompt as string
            },],
            model: "gpt-3.5-turbo"
        })
        const fullReply = askForSubject || askForSubjectIntro ? res.choices[0].message.content?.match(/MAIN: ([^\n]+)/)?.[0] : res.choices[0].message.content;
        if (!fullReply) throw new Error("fullReply is null in getSplitResponses. The response was: " + res.choices[0].message.content + " and the prompt was: " + prompt);
        //split splitResponses into paras by newline
        const splitResponses = fullReply.split('\n');
        const retrievedSubject = res.choices[0].message.content?.match(/SUBJECT: ([^\n]+)/)?.[0];
        if (!retrievedSubject && askForSubject) throw new Error("retrievedSubject is null in getSplitResponses. The response was: " + res.choices[0].message.content + " and the prompt was: " + prompt);
        const subjectIntro = res.choices[0].message.content?.match(/SUBJECTINTRO: ([^\n]+)/)?.[0];
        if (!subjectIntro && askForSubjectIntro) throw new Error("subjectIntro is null in getSplitResponses. The response was: " + res.choices[0].message.content + " and the prompt was: " + prompt);
        const srs: IMessage[] = splitResponses.map((sr, i) => ({
            content: { text: sr, active: i == 0 },
            role: 'eli' as 'user' | 'eli',
            eliResponseType: "General" as "General" | "WhatComesToMind" | "ChallengeQ",
        }));
        return { splitResponses: srs, subject: retrievedSubject, subjectIntro }
    } catch (e) {
        console.log(e);
        return null;
    }
}
export const simplifyToSubject = async (messageHistory: IMessage[]): Promise<string | null> => {
    try {
        const res = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: 'We are teaching a student together. Given the chat history: ' + messageHistory.slice(-6).map(m => m.role == "eli" ? "Assistant: '" : "Student: '" + m.content + "'").join('\n') + '\n Simplify the subject of their reply to maximum 3 words.'
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