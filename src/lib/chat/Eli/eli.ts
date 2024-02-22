import { IKnowledge, IMessagesEndpointResponsePayload, IMessagesEndpointSendPayload } from "@/lib/validation/enforceTypes";
import OpenAI from "openai";
import { howRightIsTheUser, simplifyToKnowledgePoint } from "./instructionsForRetrievingTypeOfTheirMessage";
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
export async function getNextMessage(payload: IMessagesEndpointSendPayload): Promise<IMessagesEndpointResponsePayload> {
    const { messages, metadata } = payload;
    const {
        threads,
        subject,
        action,
        lessonID, knowledgePointChain, currentKnowledgePointChainIndex
    } = metadata;
    //IF THEY'RE RESPONDING TO A WHAT COMES TO MIND QUESTION (THEY HAVE NO RELATED KNOWLEDGE ON THE SUBJECT THEY'RE ASKING ABOUT)
    if (messages.length == 3 && messages[1].eliResponseType == "WhatComesToMind") {
        const splitResponses = [];
        const theirInput = messages[messages.length - 1].content;
        const howRight = await howRightIsTheUser(messages);
        let K: IKnowledge | null = null;
        if (howRight !== 'NOT') {
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
                knowledgePointChain[currentKnowledgePointChainIndex].push(K);
            } else {
                console.log("Kp is null in getNextMessage");
            }
        }
    }
}