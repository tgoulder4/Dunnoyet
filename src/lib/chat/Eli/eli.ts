'use server'
import { IKnowledge, IMessage, IMessagesEndpointResponsePayload, IMessagesEndpointSendPayload } from "@/lib/validation/enforceTypes";
import OpenAI from "openai";
import { getChallengeQuestion, getIsQuestion, getSplitResponses, howRightIsTheUser, simplifyToKnowledgePoint, simplifyToSubject } from "./instructionsForRetrievingTypeOfTheirMessage";
import { getEmbedding } from "../openai";
import * as tsnejs from '@aidanconnelly/tsnejs'
const openai = new OpenAI();
const opt = {
    epsilon: 10,    // epsilon is learning rate (10 = default)
    perplexity: 30, // roughly how many neighbors each point influences (30 = default)
    dim: 2 // dimensionality of the embedding (2 = default)
};
const tsne = new tsnejs.tSNE(opt); // create a tSNE instance
async function getTwoDCoOrdinatesOfKnowledgePointInSolitude(Kp: string): Promise<[number, number]> {
    try {
        const em = await getEmbedding(Kp);
        const dists = em;
        tsne.initDataDist(dists);
        [...Array(100)].forEach((_, i) => tsne.step());
        const TwoDCoOrds = tsne.getSolution();
        //const 2d = tSNE(em);
        return TwoDCoOrds;
    } catch (err) {
        console.log(err + " in getTwoDCoOrdinatesOfKnowledgePointInSolitude, returning [0,0]");
        return [0, 0];
    }
}
//handles rerouting of knowledge chains
async function getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID: string, knowledgePointChain: Array<IKnowledge[] | IKnowledge>, messages: IMessage[], incrementKpChainI: (setTovalue?: number) => void, kpChainI: number, firstPotentialKnowledgePoint?: boolean): Promise<{ wasRight: boolean, knowledgePointAdded?: IKnowledge } | string> {
    const howRight = await howRightIsTheUser(messages);
    let K: IKnowledge | undefined = undefined;
    if (howRight !== 'NOT') {
        //if they're at least partly right, add their knowledge to chain
        const Kp = await simplifyToKnowledgePoint(messages);
        if (Kp == undefined) {
            return 'Something went wrong. (@simplifyToKP)'
        }

        if (Kp == null) {
            return 'I could not extract any knowledge from your input. Please try again.'
        }
        if (Kp) {
            const coOrds = await getTwoDCoOrdinatesOfKnowledgePointInSolitude(Kp);
            K = {
                confidence: 4,
                lessonId: lessonID,
                pointInSolitude: Kp,
                pointInChain: '',
                source: 'reinforced',
                TwoDCoOrd: coOrds
            }
            knowledgePointChain.splice(kpChainI, 0, K);
            if (firstPotentialKnowledgePoint) { incrementKpChainI(0) } else {
                incrementKpChainI();
            }
        } else {
            console.log("Kp is null in getNextMessage");
        }
        return {
            wasRight: true,
            knowledgePointAdded: K
        };
    }
    return {
        wasRight: false,
    };
}
async function getRelatedKnowledgePoints(KpInSolitude: string): Promise<IKnowledge[]> {
    //get the id of them from pinecone
    //find the id of each from prisma
    //return that
}
async function getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID: string, messages: IMessage[], rKs: IKnowledge[], threads: IMessage[][], knowledgePointChain: Array<IKnowledge>, indexToInsertNewKnowlegePoint: number, askForSubject?: boolean, askForSubjectIntro?: boolean, wasRight?: boolean, isNonElevatingQ?: boolean, splitResponsesLimit?: number): Promise<{
    pushedSplitResponses: IMessage[],
    newKnowledgePointChain: Array<IKnowledge>,
    newThreads: IMessage[][],
    subject?: string,
    subjectIntro?: string,
}> {
    const gptReply = await getSplitResponses(messages, rKs, undefined, askForSubject, askForSubjectIntro, wasRight ? !wasRight : undefined, splitResponsesLimit);
    if (!gptReply) throw new Error("gptReply is null in getNextMessage");
    const { splitResponses, subject, subjectIntro } = gptReply;
    if (!isNonElevatingQ) {
        threads.push(splitResponses)
    } else {
        threads[threads.length - 1].push(...splitResponses);
    }
    console.log("split responses: ", splitResponses);
    console.log("threads is now", threads)
    //mirror in knowledge chain
    const newKs = Promise.all(splitResponses.map(async (sr, i) => {
        const Kp = await simplifyToKnowledgePoint(messages, subject);
        if (!Kp) throw new Error("Kp is null in getNextMessage");
        const coOrds = await getTwoDCoOrdinatesOfKnowledgePointInSolitude(Kp);
        return {
            confidence: (i == 0) ? 4 : 2,
            lessonId: lessonID,
            pointInSolitude: sr.content as string,
            pointInChain: '',
            source: 'offered' as 'offered' | 'reinforced',
            TwoDCoOrd: coOrds
        }
    }));
    const KpsToInsertBeforeTarget = await newKs;
    const newKnowledgePointChain = knowledgePointChain.splice(indexToInsertNewKnowlegePoint, 0, ...KpsToInsertBeforeTarget);
    return {
        pushedSplitResponses: splitResponses,
        newKnowledgePointChain,
        newThreads: threads,
        subject,
        subjectIntro,
    }
}
export async function getNextMessage(payload: IMessagesEndpointSendPayload): Promise<IMessagesEndpointResponsePayload> {
    const { messages, metadata } = payload;
    const {
        threads,
        subject,
        action,
        lessonID, knowledgePointChain, currentKnowledgePointIndex
    } = metadata;
    let indexToInsertNewKnowlegePoint = currentKnowledgePointIndex;
    function incrementCurrentKnowledgePointIndex() {
        indexToInsertNewKnowlegePoint++;
    }
    //CASE NEW QUESTION
    if (messages.length == 1) {
        const theirInput = messages[messages.length - 1].content as string;
        //they could have attached knowledge to this msg
        const howRightRes = await getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID, knowledgePointChain, messages, incrementCurrentKnowledgePointIndex, indexToInsertNewKnowlegePoint);
        if (typeof howRightRes == 'string') {
            return { error: howRightRes };
        }
        const {
            wasRight,
            knowledgePointAdded
        } = howRightRes;
        //get related knowledge points
        const K = await simplifyToKnowledgePoint(messages);
        if (K == undefined) {
            return {
                error: 'Something went wrong. (@simplifyToKP)'
            }
        }
        if (K == null) {
            return {
                error: 'I could not extract any knowledge from your input. Please try again.'
            }
        }
        const rKs: IKnowledge[] = await getRelatedKnowledgePoints(K);
        //if rKs.length==0 && !wasRight then return what comes to mind q
        if (rKs.length == 0 && !wasRight) {
            const subjectOfTheirInput = await simplifyToSubject(messages);
            const randomIntBetweenZeroAnd3 = Math.floor(Math.random() * 4);
            let askMessage = "";
            switch (randomIntBetweenZeroAnd3) {
                case 0:
                    askMessage = "What immediately comes to mind when you think about " + subjectOfTheirInput + "?";
                    break;
                case 1:
                    askMessage = "What do you understand about " + subjectOfTheirInput + " already?";
                    break;
                case 2:
                    askMessage = "What do you know about " + subjectOfTheirInput + "?";
                    break;
                case 3:
                    askMessage = "What do you know about " + subjectOfTheirInput + "?";
                    break;
            }
            const payload: IMessagesEndpointResponsePayload = {
                newMessages: [{
                    content: askMessage,
                    role: 'eli',
                    eliResponseType: "WhatComesToMind"
                }],
                metadata: {
                    lessonID,
                    threads,
                    knowledgePointChain,
                    currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
                }
            }
            return payload;
        } else {
            //use rks to form splitresponses and add to threads & knowledge chain
            const result = await getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID, messages, knowledgePointAdded ? rKs.concat(knowledgePointAdded) : rKs, threads, knowledgePointChain, indexToInsertNewKnowlegePoint, wasRight, true, true);
            if (!result) throw new Error("result is null in getNextMessage");
            const { pushedSplitResponses, newKnowledgePointChain, newThreads, subject, subjectIntro } = result;
            if (!subject || !subjectIntro) throw new Error("subject or subjectIntro is null in getNextMessage");
            const payload: IMessagesEndpointResponsePayload = {
                newMessages: [{
                    content: subjectIntro,
                    role: 'eli',
                    eliResponseType: 'SubjectIntroduction'
                }, newThreads[newThreads.length - 1][0]],
                metadata: {
                    lessonID,
                    threads: newThreads,
                    subject: subject,
                    knowledgePointChain: newKnowledgePointChain,
                    currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
                }
            }
            return payload;
        }
    }
    //IF THEY UNDERSTAND THE CURRENT THREAD SPLITRESPONSE. knowledgePointChain: like [{confidecne:4...},[{confidence:5...},{confidence:5...}]]
    if (action == "understood") {
        const currentKP = knowledgePointChain[currentKnowledgePointIndex];
        currentKP.confidence = 5;
        //remove response from threads
        const tL = threads[threads.length - 1].length;
        if (tL == 0) { throw new Error("tL is 0 in getNextMessage. Minimum is 1, addressed split response messages/interrogative qs are removed after this point in the backend, not in the client or before."); }
        else if (tL >= 1) {
            threads[threads.length - 1].unshift();
        }
        if (tL == 1) {
            //respond w a challenge q
            if (!subject) throw new Error("subject is null in challenge q, should be defined from newMsg or whatComesToMind response onwards.");
            const challengeQ = await getChallengeQuestion(subject, messages); //tests their knowledge on currentkp.pointinsol as they said they just understood it
            if (!challengeQ) throw new Error("challengeQ is null in getNextMessage");
            const m = {
                content: challengeQ,
                role: 'eli' as 'eli' | 'user',
                eliResponseType: "ChallengeQ" as "ChallengeQ" | "General" | "WhatComesToMind"
            }
            threads[threads.length - 1].push(m)
            const payload: IMessagesEndpointResponsePayload = {
                newMessages: [m],
                metadata: {
                    lessonID,
                    threads,
                    knowledgePointChain,
                    currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
                }
            }
            return payload;
        }
    }
    //IF THEY'RE RESPONDING TO A WHAT COMES TO MIND QUESTION (THEY HAVE NO RKS ON THE SUBJECT THEY'RE ASKING ABOUT)
    if (messages.length == 3 && messages[1].eliResponseType == "WhatComesToMind") {
        const theirInput = messages[messages.length - 1].content as string;
        const howRightRes = await getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID, knowledgePointChain, messages, incrementCurrentKnowledgePointIndex, indexToInsertNewKnowlegePoint);
        if (typeof howRightRes == 'string') {
            return { error: howRightRes };
        }
        const {
            wasRight,
            knowledgePointAdded
        } = howRightRes;
        //get teaching reply split into paras
        const result = await getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID, messages, knowledgePointAdded ? [knowledgePointAdded] : [], threads, knowledgePointChain, indexToInsertNewKnowlegePoint, wasRight, true, true);
        if (!result) throw new Error("result is null in getNextMessage");
        const { pushedSplitResponses, newKnowledgePointChain, newThreads, subject, subjectIntro } = result;
        const payload: IMessagesEndpointResponsePayload = {
            newMessages: splitResponses,
            metadata: {
                lessonID,
                threads: newThreads,
                intro: (subject && subjectIntro) ? { subject, subjectIntro } : undefined,
                knowledgePointChain: newKnowledgePointChain,
                currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
            }
        }
        return payload;
    }
    if (!subject) throw new Error("subject is null, should be defined from here onwards.");
    const isQ = await getIsQuestion(subject, messages);
    if (isQ) {
        const howRightRes = await getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID, knowledgePointChain, messages, incrementCurrentKnowledgePointIndex, indexToInsertNewKnowlegePoint);
        if (typeof howRightRes == 'string') {
            return { error: howRightRes };
        }
        const {
            wasRight,
            knowledgePointAdded
        } = howRightRes;
        //get related knowledge points
        const K = knowledgePointChain[indexToInsertNewKnowlegePoint];
        const rKs: IKnowledge[] = await getRelatedKnowledgePoints(K.pointInSolitude);

        //CHANGE OF PLAN: use previous rks from this level to form splitresponses and add to threads & knowledge chain. finding rks on every question send would be visually cluttering and expensive
        //use rks to form splitresponses and add to threads & knowledge chain
        threads[threads.length - 1].unshift();
        const result = await getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID, messages, knowledgePointAdded ? rKs.concat(knowledgePointAdded) : rKs, threads, knowledgePointChain, indexToInsertNewKnowlegePoint, wasRight, true, false, false);
        if (!result) throw new Error("result is null in getNextMessage");
        const { pushedSplitResponses, newKnowledgePointChain, newThreads, subject, subjectIntro } = result;
        const payload: IMessagesEndpointResponsePayload = {
            newMessages: [newThreads[newThreads.length - 1][0]],
            metadata: {
                lessonID,
                threads: newThreads,
                subject: subject,
                knowledgePointChain: newKnowledgePointChain,
                currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
            }
        }
        return payload;
    }
    //IF THEY'RE RESPONDING TO A CHALLENGE QUESTION
    if (threads[threads.length - 1][0].eliResponseType == "ChallengeQ") {
        const howRightRes = await getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID, knowledgePointChain, messages, incrementCurrentKnowledgePointIndex, indexToInsertNewKnowlegePoint);
        if (typeof howRightRes == 'string') {
            return { error: howRightRes };
        }
        const {
            wasRight,
            knowledgePointAdded
        } = howRightRes;
        if (!wasRight) {
            threads[threads.length - 1].unshift()
            console.log("was not right in challenge q");
            const rKs = knowledgePointChain.slice(0, indexToInsertNewKnowlegePoint + 1);
            console.log("rKs being used is", rKs)
            const result = await getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID, messages, rKs, threads, knowledgePointChain, indexToInsertNewKnowlegePoint, wasRight, true, true, true);
            if (!result) throw new Error("result is null in getNextMessage");
            const { pushedSplitResponses, newKnowledgePointChain, newThreads, subject, subjectIntro } = result;
            const payload: IMessagesEndpointResponsePayload = {
                newMessages: pushedSplitResponses,
                metadata: {
                    lessonID,
                    threads: newThreads,
                    knowledgePointChain: newKnowledgePointChain,
                    currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
                }
            }
            return payload;
        } else {
            if (threads.length == 1) {
                //save all rks to db and pinecone, 
                //end lesson
                const payload: IMessagesEndpointResponsePayload = {
                    newMessages: [],
                    metadata: {
                        lessonID,
                        threads: [],
                        knowledgePointChain: [],
                        currentKnowledgePointIndex: 0,
                        action: "endLesson"
                    }
                }
                return payload;
            } else {
                threads.unshift();
                //merge rest of messages from new current thread with rKs --future feature
                const payload: IMessagesEndpointResponsePayload = {
                    newMessages: [threads[threads.length - 1][0]],
                    metadata: {
                        lessonID,
                        threads,
                        knowledgePointChain,
                        currentKnowledgePointIndex: 0
                    }
                }
                return payload;
            }
        }

    }
}