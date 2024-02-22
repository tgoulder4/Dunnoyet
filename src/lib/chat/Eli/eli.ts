import { IKnowledge, IMessage, IMessagesEndpointResponsePayload, IMessagesEndpointSendPayload } from "@/lib/validation/enforceTypes";
import OpenAI from "openai";
import { getSplitResponses, howRightIsTheUser, simplifyToKnowledgePoint, simplifyToSubject } from "./instructionsForRetrievingTypeOfTheirMessage";
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
async function getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID: string, indexToInsertNewKnowlegePoint: number, knowledgePointChain: Array<IKnowledge[] | IKnowledge>, messages: IMessage[], firstPotentialKnowledgePoint?: boolean): Promise<{ wasRight: boolean, newIndexToInsertKnowledgePoint: number, knowledgePointAdded?: IKnowledge }> {
    const howRight = await howRightIsTheUser(messages);
    let K: IKnowledge | undefined = undefined;
    if (howRight !== 'NOT') {
        //if they're at least partly right, add their knowledge to chain
        const Kp = await simplifyToKnowledgePoint(messages);
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
            knowledgePointChain.push(K);
            if (firstPotentialKnowledgePoint) { indexToInsertNewKnowlegePoint = 0; } else {
                indexToInsertNewKnowlegePoint++;
            }
        } else {
            console.log("Kp is null in getNextMessage");
        }
        return {
            wasRight: true,
            newIndexToInsertKnowledgePoint: indexToInsertNewKnowlegePoint,
            knowledgePointAdded: K
        };
    }
    return {
        wasRight: false,
        newIndexToInsertKnowledgePoint: indexToInsertNewKnowlegePoint
    };
}
async function getRelatedKnowledgePoints(KpInSolitude: string): Promise<IKnowledge[]> {

}
async function getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID: string, messages: IMessage[], rKs: IKnowledge[], threads: IMessage[][], knowledgePointChain: Array<IKnowledge[] | IKnowledge>, indexToInsertNewKnowlegePoint: number, askForSubject?: boolean, askForSubjectIntro?: boolean, wasRight?: boolean): Promise<{
    splitResponses: IMessage[],
    newKnowledgePointChain: Array<IKnowledge[] | IKnowledge>,
    newThreads: IMessage[][],
    subject?: string,
    subjectIntro?: string,
    newIndexToInsertKnowledgePoints: number
}> {
    const gptReply = await getSplitResponses(messages, rKs, undefined, askForSubject, askForSubjectIntro, wasRight ? !wasRight : undefined);
    if (!gptReply) throw new Error("gptReply is null in getNextMessage");
    const { splitResponses, subject, subjectIntro } = gptReply;

    threads[threads.length - 1].push(...splitResponses);
    console.log("split responses: ", splitResponses);
    console.log("threads is now", threads)
    //mirror in knowledge chain
    const newKs = Promise.all(splitResponses.map(async (sr, i) => {
        const Kp = await simplifyToKnowledgePoint(messages, subject);
        if (!Kp) throw new Error("Kp is null in getNextMessage");
        const coOrds = await getTwoDCoOrdinatesOfKnowledgePointInSolitude(Kp);
        return {
            confidence: (i == 0 && !wasRight) ? 4 : 2,
            lessonId: lessonID,
            pointInSolitude: sr.content as string,
            pointInChain: '',
            source: 'offered' as 'offered' | 'reinforced',
            TwoDCoOrd: coOrds
        }
    }));
    const additionalKnowledgePoints = await newKs;
    const newKnowledgePointChain = knowledgePointChain.splice(indexToInsertNewKnowlegePoint, 0, additionalKnowledgePoints);
    indexToInsertNewKnowlegePoint++;
    return {
        splitResponses,
        newKnowledgePointChain,
        newThreads: threads,
        subject,
        subjectIntro,
        newIndexToInsertKnowledgePoints: indexToInsertNewKnowlegePoint
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
    //CASE NEW QUESTION
    if (messages.length == 1) {
        const theirInput = messages[messages.length - 1].content as string;
        //they could have attached knowledge to this msg
        const { wasRight, newIndexToInsertKnowledgePoint, knowledgePointAdded } = await getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID, indexToInsertNewKnowlegePoint, knowledgePointChain, messages);
        indexToInsertNewKnowlegePoint = newIndexToInsertKnowledgePoint;
        //get related knowledge points
        const knowledgePointOfTheirInput = await simplifyToKnowledgePoint(messages);
        if (!knowledgePointOfTheirInput) throw new Error("knowledgePointOfTheirInput is null in getNextMessage case NEW QUESTION");
        const rKs: IKnowledge[] = await getRelatedKnowledgePoints(knowledgePointOfTheirInput);
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
            const { splitResponses, newKnowledgePointChain, newThreads, subject, subjectIntro, newIndexToInsertKnowledgePoints, } = result;
            if (newIndexToInsertKnowledgePoint) indexToInsertNewKnowlegePoint = newIndexToInsertKnowledgePoints;
            const payload: IMessagesEndpointResponsePayload = {
                newMessages: splitResponses,
                metadata: {
                    lessonID,
                    threads: newThreads,
                    intro: (subject && subjectIntro) ? { subject, subjectIntro } : undefined,
                    knowledgePointChain: newKnowledgePointChain,
                    currentKnowledgePointIndex: newIndexToInsertKnowledgePoints
                }
            }
            return payload;
        }
    }
    //IF THEY UNDERSTAND THE CURRENT THREAD SPLITRESPONSE. knowledgePointChain: like [{confidecne:4...},[{confidence:5...},{confidence:5...}]]
    if (action == "understood") {
        const currentKP = knowledgePointChain[currentKnowledgePointIndex];
        if (Array.isArray(currentKP)) {
            //find the index where the confidence isn't 5
            const i = currentKP.findIndex(kp => kp.confidence !== 5);
            //change it to 5
            currentKP[i].confidence = 5;
        } else {
            currentKP.confidence = 5;

        }
        //remove response from threads
        threads[threads.length - 1].unshift();
        const payload: IMessagesEndpointResponsePayload = {
            newMessages: [],
            metadata: {
                lessonID,
                threads,
                knowledgePointChain,
                currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
            }
        }
        return payload;
    }
    //IF THEY'RE RESPONDING TO A WHAT COMES TO MIND QUESTION (THEY HAVE NO SAVED RELATED KNOWLEDGE ON THE SUBJECT THEY'RE ASKING ABOUT)
    if (messages.length == 3 && messages[1].eliResponseType == "WhatComesToMind") {
        const theirInput = messages[messages.length - 1].content as string;
        const { wasRight, newIndexToInsertKnowledgePoint, knowledgePointAdded } = await getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID, indexToInsertNewKnowlegePoint, knowledgePointChain, messages);
        indexToInsertNewKnowlegePoint = newIndexToInsertKnowledgePoint;
        //get teaching reply split into paras
        const result = await getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID, messages, knowledgePointAdded ? [knowledgePointAdded] : [], threads, knowledgePointChain, indexToInsertNewKnowlegePoint, wasRight, true, true);
        if (!result) throw new Error("result is null in getNextMessage");
        const { splitResponses, newKnowledgePointChain, newThreads, subject, subjectIntro, newIndexToInsertKnowledgePoints } = result;
        if (newIndexToInsertKnowledgePoint) indexToInsertNewKnowlegePoint = newIndexToInsertKnowledgePoints;
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
}