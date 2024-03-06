'use server'
import getServerSession from 'next-auth';
import { IKnowledge, IMessage, IMessagesEndpointResponsePayload, IMessagesEndpointSendPayload } from "@/lib/validation/enforceTypes";
import OpenAI from "openai";
import { getIsQuestion, getSplitResponses, howRightIsTheUser, simplifyToKnowledgePointInSolitude, simplifyToSubject } from "./instructionsForRetrievingTypeOfTheirMessage";
import { getEmbedding } from "../openai";
//if doesn't work TRY  https://socket.dev/npm/package/@keckelt/tsne
import { knowledgeIndex } from "../pinecone";
import prisma from "../../../lib/db/prisma";
import { authConfig } from '@/auth.config';
import { getTwoDCoOrdinatesOfEmbeddings } from '@/components/UserArea/Learn/Lesson/network';
//handles rerouting of knowledge chains
async function getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID: string, knowledgePointChain: Array<IKnowledge[] | IKnowledge>, messages: IMessage[], incrementKpChainI: (setTovalue?: number) => void, kpChainI: number, firstPotentialKnowledgePoint?: boolean): Promise<{ wasRight: boolean, knowledgePointAdded?: IKnowledge } | string> {
    const howRight = await howRightIsTheUser(messages);
    console.log("@getNextMessage @getHowRightTheUserIsAnd... - How right the user is: ", howRight)
    let K: IKnowledge | undefined = undefined;
    if (howRight !== 'NOT') {
        //if they're at least partly right, add their knowledge to chain
        console.log("@getHowRightTheUserIsAnd... - they were right, calling simplifyToKnowledgePointInSolitude")
        const Kp = await simplifyToKnowledgePointInSolitude(messages);
        if (Kp === undefined) {
            console.log("Kp is undefined @getHowRightTheUserIsAnd... - the simplified knowledge point is undefined meaning an error occurred.")
            return 'There was an error @simplifyKnowledgePoint (kp is undefined). Check the server logs for more info.';
        }

        if (Kp === null) {
            console.log("Not enough extractable knowledge from their input. @getHowRightTheUserIsAnd...")
            return 'I could not extract any knowledge from your input. Please explain what you know and how you know it.';
        }
        console.log("getting embedding of their knowledge point in solitude...")
        const embedding = await getEmbedding(Kp);
        K = {
            confidence: 5,
            lessonId: lessonID,
            pointInSolitude: Kp,
            pointInChain: '',
            source: 'reinforced',
            vectorEmbedding: embedding,
            TwoDCoOrdinates: []
        }
        console.log("inserting knowledge point into knowledge chain at index: ", kpChainI)
        if (firstPotentialKnowledgePoint) incrementKpChainI(0)
        knowledgePointChain.splice(kpChainI, 0, K);
        console.log("knoweldge point added to KpChain: ", K, "at index: ", kpChainI)
        incrementKpChainI();
        console.log("incremented kpChainI to: ", kpChainI)
        return {
            wasRight: true,
            knowledgePointAdded: K
        };
    }
    return {
        wasRight: false,
    };
}
export async function getRelatedKnowledgePoints(userId: string, KpInSolitude: string): Promise<IKnowledge[] | null> {
    try {
        const vK = await getEmbedding(KpInSolitude);
        if (vK == null) throw new Error("vK is null in getRelatedKnowledgePoints");
        const queryResponse = await knowledgeIndex.query({
            vector: vK,
            topK: 5,
            filter: { source: 'reinforced', userId: userId }
        })
        const rVks = queryResponse.matches;
        const rKs = await Promise.all(
            rVks.map(async (rVk) => {
                const kp = await prisma.knowledgePoint.findUnique({
                    where: {
                        id: rVk.id
                    }
                })
                if (kp == null) {
                    console.log("kp is null @getRelatedKnowledgePoints - the related vector knowledge's ID didn't match any knowledge points in the db. Its ID is " + rVk.id + ". Returning a dummy knowledge point w confidence -1.")
                    return null;
                }
                return kp;
            })
        )
        if (!rKs) throw new Error("rKs is null in getRelatedKnowledgePoints");
        console.log("rKs: ", rKs)
        return rKs as IKnowledge[];
    } catch (e) {
        console.log(e)
        return null;
    }
    //get the id of them from pinecone
    //find the id of each from prisma
    //return that
}
export async function saveKnowledgePointsToDBAndPineCone(lessonID: string, knowledgePointChain: IKnowledge[], userID: string, metadataId: string) {
    try {
        console.log("savekNowledgePointsToDBAndPineCone called")
        const _kps = await Promise.all(knowledgePointChain.map(async (Kp) => {
            const updatedUser = await prisma.$transaction(async (tx) => {
                const em = await getEmbedding(Kp.pointInSolitude);
                console.log("embedding formed: ", em, "for KpSol: ", Kp.pointInSolitude)
                const K = await tx.knowledgePoint.create({
                    data: {
                        metadataId: metadataId,
                        lessonId: lessonID,
                        userId: userID,
                        source: Kp.source,
                        pointInSolitude: Kp.pointInSolitude,
                        pointInChain: "",
                        TwoDCoOrdinates: Kp.TwoDCoOrdinates,
                        confidence: Kp.confidence
                    }
                })
                // putting it inside the user instead for faster access
                console.log("updating user by userID: ", userID)
                const updatedUser = await tx.user.findUnique({
                    where: { id: userID }, include: { knowledgePoints: true },
                });
                console.log("the user is now: ", updatedUser)
                if (!updatedUser) throw new Error("kp is null in saveKnowledgePointsToDBAndPineCone");
                console.log("upserting to pinecone...")
                await knowledgeIndex.upsert([{
                    id: K.id,
                    values: em,
                    metadata: {
                        source: Kp.source,
                        userId: userID
                    }
                }])
                console.log("upserted to pinecone")
                return updatedUser;
            })
            return updatedUser.knowledgePoints;
        })
        )
        return _kps;
    } catch (e) {
        console.log(e)
        return null;
    }
}
async function getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID: string, messages: IMessage[], rKs: IKnowledge[], threads: IMessage[][], knowledgePointChain: Array<IKnowledge>, indexToInsertNewKnowlegePoint: number, askForSubject?: boolean, askForSubjectIntro?: boolean, wasRight?: boolean, isNonElevatingQ?: boolean, splitResponsesLimit?: number, subjects?: string[]): Promise<{
    pushedSplitResponses: IMessage[],
    newKnowledgePointChain: Array<IKnowledge>,
    newThreads: IMessage[][],
    knowledgePointInSolitudeCreated: string,
    subjects?: string[],
    subjectIntro?: string,
} | string> {
    console.log("getting split responses...")
    const gptReply = await getSplitResponses(messages, rKs, undefined, askForSubject, askForSubjectIntro, wasRight ? !wasRight : undefined, splitResponsesLimit);
    console.log("getSplitResponses returned: ", gptReply)
    if (!gptReply) throw new Error("gptReply is null in getNextMessage");
    const { splitResponses, subject, subjectIntro } = gptReply;
    if (!subject) throw new Error("gptReply subject is null in getNextMessage @getSplitResponsesAndAddToKnowledgePointChainAndThreads.");
    if (!subjects) {
        console.log("subjects is falsy, setting it to an empty array. @getSplitResponsesAndAddToK...")
        subjects = []
    };
    console.log("@getSplitResponsesAndAddToK... - calling simplifyToKnowledgePointInSolitude")
    const pointInSolitude = await simplifyToKnowledgePointInSolitude(messages, subjects[subjects.length - 1]);
    console.log("Their input was simplified to kpInSolitude: ", pointInSolitude)
    if (pointInSolitude === undefined) throw new Error("pointInSolitude response from GPT is undefined @getNextMessage");

    if (pointInSolitude === null) return errorCodes.notEnoughExtractableKnowledge;
    subjects.push(subject);
    console.log("subjects is now: ", subjects, " after adding: ", subject)
    if (!isNonElevatingQ) {
        console.log("this is an elevating question so pushing splitResponses to the next thread level")
        threads.push(splitResponses)
    } else {
        console.log("this is a non-elevating question so pushing splitResponses to the current thread level")
        threads[threads.length - 1].push(...splitResponses);
        console.log("threads is now", threads)
    }
    if (!subjects) throw new Error("subjects is falsy, can't simplify split responses to knowlege points without subjects. @getNextMessage");
    //mirror in knowledge chain
    const newKs = await Promise.all(splitResponses.map(async (sr, i) => {
        //if it's a new question 
        const srPointInSol = await simplifyToKnowledgePointInSolitude([...messages, ...splitResponses.slice(i + 1)], subjects![subjects!.length - 1]);
        console.log("This splitResponse was simplified to kpInSolitude: ", pointInSolitude, " ")
        if (srPointInSol === undefined || srPointInSol === null) throw new Error("pointInSolitude response from GPT is undefined or null, generated srs should always yield a knowlege point. @getNextMessage");
        return {
            confidence: (i == 0) ? 4 : 2, //5=wellKnown, 4=currentlyTeaching, 3=failedTest,2=target,1=makeNewKnowledgeAnchorPoint
            lessonId: lessonID,
            pointInSolitude: srPointInSol as string,
            pointInChain: '',
            source: 'offered' as 'offered' | 'reinforced',
            TwoDCoOrdinates: [],
            vectorEmbedding: await getEmbedding(srPointInSol)
        }
    }));
    const KpsToInsertBeforeTarget = await newKs;
    const newKnowledgePointChain = knowledgePointChain.splice(indexToInsertNewKnowlegePoint, 0, ...KpsToInsertBeforeTarget);
    return {
        pushedSplitResponses: splitResponses,
        newKnowledgePointChain,
        newThreads: threads,
        subjects,
        subjectIntro,
        knowledgePointInSolitudeCreated: pointInSolitude
    }
}
const errorCodes = {
    userIDUndefined: "INTERNAL: The user's ID was undefined.",
    notEnoughExtractableKnowledge: "There wasn't enough extractable knowledge from your reply. Show me what you know!",
    SimplifiedKnowledgePointIsUndefined: "INTERNAL: The simplified knowledge point is undefined.",
}
export async function getNextMessage(payload: IMessagesEndpointSendPayload): Promise<IMessagesEndpointResponsePayload | string> {
    const { messages, metadata } = payload;
    const {
        threads,
        subjects,
        action,
        lessonID, knowledgePointChain, currentKnowledgePointIndex, metadataId
    } = metadata;
    console.log("getNextMessage called with payload: ", payload)
    const sess = await getServerSession(authConfig).auth();
    if (!sess) return errorCodes.userIDUndefined;
    const userID = sess.user?.id;
    if (!userID) {
        throw new Error("userID is undefined. @getNextMessage")
    }
    if (!metadataId) {
        throw new Error("metadataId is undefined. @getNextMessage")
    }
    let indexToInsertNewKnowlegePoint = currentKnowledgePointIndex;
    function incrementCurrentKnowledgePointIndex() {
        indexToInsertNewKnowlegePoint++;
    }
    //CASE NEW QUESTION
    if (messages.length == 1) {
        console.log("messages.length == 1, assuming their input is a new question. @getNextMessage")
        //they could have attached knowledge to this msg
        console.log("getting how right the user is and if right add to knowledge chain")
        const howRightRes = await getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID, knowledgePointChain, messages, incrementCurrentKnowledgePointIndex, indexToInsertNewKnowlegePoint);

        if (typeof howRightRes == 'string') {
            return howRightRes;
        }
        const {
            wasRight,
            knowledgePointAdded
        } = howRightRes;
        //get related knowledge points
        const pointInSolitude = knowledgePointAdded?.pointInSolitude;
        console.log("Their input was simplified to kpInSolitude: ", pointInSolitude)
        if (pointInSolitude === undefined) throw new Error("pointInSolitude response from GPT is undefined @getNextMessage");
        if (pointInSolitude === null) return errorCodes.notEnoughExtractableKnowledge;
        const rKs: IKnowledge[] | null = await getRelatedKnowledgePoints(userID, pointInSolitude);
        console.log("rKs: ", rKs)
        if (rKs == null) throw new Error("rKs is null in getNextMessage");
        //if rKs.length==0 && !wasRight then return what comes to mind q
        const subjectOfTheirInput = await simplifyToSubject(messages);
        if (rKs.length == 0 && !wasRight) {
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
                    askMessage = "What do you think about when " + subjectOfTheirInput + " is mentioned?";
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
                    subjects,
                    knowledgePointChain,
                    currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
                }
            }
            console.log("payload:", payload);
            return payload;
        } else {
            //use rks to form splitresponses and add to threads & knowledge chain
            const result = await getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID, messages, knowledgePointAdded ? rKs.concat(knowledgePointAdded) : rKs, threads, knowledgePointChain, indexToInsertNewKnowlegePoint, wasRight, true, true);
            if (typeof result == 'string') {
                return result;
            }
            if (!result) throw new Error("result is null in getNextMessage");
            const { pushedSplitResponses, newKnowledgePointChain, newThreads, subjects, subjectIntro } = result;
            if (!subjectIntro) throw new Error("subject or subjectIntro is null in getNextMessage");
            if (!subjects) throw new Error("subjects wasn't passed to getNextMessage. It should be.");
            const payload: IMessagesEndpointResponsePayload = {
                newMessages: [{
                    content: subjectIntro,
                    role: 'eli',
                    eliResponseType: 'SubjectIntroduction'
                }, newThreads[newThreads.length - 1][0]],
                metadata: {
                    lessonID,
                    threads: newThreads,
                    subjects,
                    knowledgePointChain: newKnowledgePointChain,
                    currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
                }
            }
            console.log("payload:", payload);
            return payload;
        }
    }
    //IF THEY UNDERSTAND THE CURRENT THREAD SPLITRESPONSE. knowledgePointChain: like [{confidecne:4...},[{confidence:5...},{confidence:5...}]]
    else if (action == "UNDERSTOOD") {
        const currentKP = knowledgePointChain[currentKnowledgePointIndex];
        currentKP.confidence = 5;
        //remove response from threads
        const tL = threads[threads.length - 1].length;
        if (tL == 0) { throw new Error("tL is 0 in getNextMessage. Minimum is 1, addressed split response messages/interrogative qs are removed after this point in the backend, this should not be done in the client or before."); }
        else if (tL >= 1) {
            threads[threads.length - 1].shift();
        }
        if (tL == 0) {
            threads.pop();
            subjects.pop();
            //POSTPONED: respond w a challenge q
            // if (!subjects) throw new Error("subjects is null in challenge q, should be defined from newMsg or whatComesToMind response onwards.");
            // const challengeQ = await getChallengeQuestion(subjects[subjects?.length - 1], messages); //tests their knowledge on currentkp.pointinsol as they said they just understood it
            // if (!challengeQ) throw new Error("challengeQ is null in getNextMessage");
            // const m = {
            //     content: challengeQ,
            //     role: 'eli' as 'eli' | 'user',
            //     eliResponseType: "ChallengeQ" as "ChallengeQ" | "General" | "WhatComesToMind"
            // }
            // threads[threads.length - 1].push(m)
        }
        if (threads.length == 0) {
            //save all rks to db and pinecone, 
            saveKnowledgePointsToDBAndPineCone(lessonID, knowledgePointChain, userID, metadataId);
            //end lesson
            const payload: IMessagesEndpointResponsePayload = {
                newMessages: [],
                metadata: {
                    lessonID,
                    threads: [],
                    subjects,
                    knowledgePointChain: [],
                    currentKnowledgePointIndex: 0,
                    action: "ENDLESSON"
                }
            }
            console.log("payload:", payload);
            return payload;
        }
        //TODO: REPLACE REST OF PREVIOUS THREAD W KNOWLEDGE IN TERMS OF WHAT THEY JUST LEARNED?
        const payload: IMessagesEndpointResponsePayload = {
            newMessages: [threads[threads.length - 1][0]],
            metadata: {
                lessonID,
                threads,
                subjects,
                knowledgePointChain,
                currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
            }
        }
        console.log("payload:", payload);
        return payload;
    }
    //IF THEY'RE RESPONDING TO A WHAT COMES TO MIND QUESTION (THEY HAVE NO RKS ON THE SUBJECT THEY'RE ASKING ABOUT)
    else if (messages.length == 3 && messages[1].eliResponseType == "WhatComesToMind") {
        console.log("they're responding to a what comes to mind question. @getNextMessage")
        const howRightRes = await getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID, knowledgePointChain, messages, incrementCurrentKnowledgePointIndex, indexToInsertNewKnowlegePoint);
        if (typeof howRightRes == 'string') {
            return howRightRes;
        }
        const {
            wasRight,
            knowledgePointAdded
        } = howRightRes;
        //get teaching reply split into paras
        if (threads[threads.length - 1][0].eliResponseType != "WhatComesToMind") throw new Error("Messages and threads are not in sync. (Expected threads[threads.length-1][0].eliResponseType to be 'WhatComesToMind')");
        console.log("shifting threads[threads.length-1] as it's been addressed")
        threads[threads.length - 1].shift();
        console.log("threads is now", threads);
        let rKs: IKnowledge[] = [];
        if (wasRight) {
            if (!knowledgePointAdded) throw new Error("knowledgePointAdded is null in getNextMessage, and they were right.");
            const rksResponse = await getRelatedKnowledgePoints(userID, knowledgePointAdded?.pointInSolitude);
            console.log("rKs: ", rKs)
            if (rksResponse == null) throw new Error("rKs is null in getNextMessage");
            rKs = rksResponse;
        }
        const result = await getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID, messages, knowledgePointAdded ? [...rKs, knowledgePointAdded] : rKs, threads, knowledgePointChain, indexToInsertNewKnowlegePoint, wasRight, true, true, true);
        if (typeof result == 'string') {
            return result;
        }
        if (!result) throw new Error("result is null in getNextMessage");
        const { pushedSplitResponses, newKnowledgePointChain, newThreads, subjects, subjectIntro } = result;
        if (!subjects || !subjectIntro) throw new Error("subjects or subjectIntro is null in getNextMessage");
        const payload: IMessagesEndpointResponsePayload = {
            newMessages: [{
                content: subjectIntro,
                role: 'eli',
                eliResponseType: 'SubjectIntroduction'
            }, newThreads[newThreads.length - 1][0]],
            metadata: {
                lessonID,
                threads: newThreads,
                subjects,
                knowledgePointChain: newKnowledgePointChain,
                currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
            }
        }
        console.log("payload:", payload);
        return payload;
    }
    else if (!subjects) throw new Error("subject is null, should be defined from here onwards.");
    else if (await getIsQuestion(subjects[subjects.length - 1], messages)) {
        const howRightRes = await getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID, knowledgePointChain, messages, incrementCurrentKnowledgePointIndex, indexToInsertNewKnowlegePoint);
        if (typeof howRightRes == 'string') {
            return howRightRes;
        }
        const {
            wasRight,
            knowledgePointAdded
        } = howRightRes;
        //get related knowledge points
        const K = knowledgePointChain[indexToInsertNewKnowlegePoint];
        const rKs: IKnowledge[] | null = await getRelatedKnowledgePoints(userID, K.pointInSolitude);
        if (rKs == null) throw new Error("rKs is null in getNextMessage @isQ");

        //CHANGE OF PLAN: use previous rks from this level to form splitresponses and add to threads & knowledge chain. finding rks on every question send would be visually cluttering and expensive
        //use rks to form splitresponses and add to threads & knowledge chain
        threads[threads.length - 1].shift();
        const result = await getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID, messages, knowledgePointAdded ? rKs.concat(knowledgePointAdded) : rKs, threads, knowledgePointChain, indexToInsertNewKnowlegePoint, wasRight, true, false, false);
        if (typeof result == 'string') {
            return result;
        }
        if (!result) throw new Error("result is null in getNextMessage");
        const { pushedSplitResponses, newKnowledgePointChain, newThreads, subjects, subjectIntro } = result;
        if (!subjects || !subjectIntro) throw new Error("subjects or subjectIntro is null in getNextMessage @isQ");
        const payload: IMessagesEndpointResponsePayload = {
            newMessages: [newThreads[newThreads.length - 1][0]],
            metadata: {
                lessonID,
                threads: newThreads,
                subjects,
                knowledgePointChain: newKnowledgePointChain,
                currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
            }
        }
        console.log("payload:", payload);
        return payload;
    }
    //POSTPONED:IF THEY'RE RESPONDING TO A CHALLENGE QUESTION
    // if (threads[threads.length - 1][0].eliResponseType == "ChallengeQ") {
    //     threads[threads.length - 1].shift() //because addressed
    //     const wasRight = await getIsQuestionResponseTrueOrFalse(messages);
    //     if (wasRight == null) throw new Error("wasRight is null in getNextMessage");
    //     if (!wasRight) {
    //         console.log("was not right in challenge q");
    //         console.log("threads is now", threads)
    //         const rKs = knowledgePointChain.slice(0, indexToInsertNewKnowlegePoint + 1);
    //         console.log("rKs being used is", rKs)
    //         const result = await getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID, messages, rKs, threads, knowledgePointChain, indexToInsertNewKnowlegePoint, false, false, false, true);
    //         if (!result) throw new Error("result is null in getNextMessage");
    //         const { pushedSplitResponses, newKnowledgePointChain, newThreads } = result;
    //         subjects.pop();
    //         const payload: IMessagesEndpointResponsePayload = {
    //             newMessages: [newThreads[newThreads.length - 1][0]],
    //             metadata: {
    //                 lessonID,
    //                 threads: newThreads,
    //                 subjects,
    //                 knowledgePointChain: newKnowledgePointChain,
    //                 currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
    //             }
    //         }
    //         console.log("payload:", payload);
    //         return payload;
    //     } else {
    //         if (threads.length == 1) {
    //             //save all rks to db and pinecone, 
    //             saveKnowledgePointsToDBAndPineCone(lessonID, knowledgePointChain);
    //             //end lesson
    //             const payload: IMessagesEndpointResponsePayload = {
    //                 newMessages: [],
    //                 metadata: {
    //                     lessonID,
    //                     threads: [],
    //                     knowledgePointChain: [],
    //                     currentKnowledgePointIndex: 0,
    //                     action: "endLesson"
    //                 }
    //             }
    //             console.log("payload:", payload);
    //             return payload;
    //         } else {
    //             threads.pop();
    //             subjects.pop();
    //             //merge rest of messages from new current thread with rKs --future feature
    //             const payload: IMessagesEndpointResponsePayload = {
    //                 newMessages: [threads[threads.length - 1][0]],
    //                 metadata: {
    //                     lessonID,
    //                     threads,
    //                     knowledgePointChain,
    //                     currentKnowledgePointIndex: 0
    //                 }
    //             }
    //             console.log("payload:", payload);
    //             return payload;
    //         }
    //     }

    // }
    else {
        const howRightRes = await getHowRightTheUserIsAndIfRightAddToKnowledgeChain(lessonID, knowledgePointChain, messages, incrementCurrentKnowledgePointIndex, indexToInsertNewKnowlegePoint);
        if (typeof howRightRes == 'string') {
            return howRightRes;
        }
        const {
            wasRight,
            knowledgePointAdded
        } = howRightRes;
        //get related knowledge points
        const rKs = knowledgePointChain;

        //CHANGE OF PLAN: use previous rks from this level to form splitresponses and add to threads & knowledge chain. finding rks on every question send would be visually cluttering and expensive
        //use rks to form splitresponses and add to threads & knowledge chain
        threads[threads.length - 1].shift();
        const result = await getSplitResponsesAndAddToKnowledgePointChainAndThreads(lessonID, messages, knowledgePointAdded ? rKs.concat(knowledgePointAdded) : rKs, threads, knowledgePointChain, indexToInsertNewKnowlegePoint, wasRight, true, false, true);
        if (typeof result == 'string') {
            return result;
        }
        if (!result) throw new Error("result is null in getNextMessage");
        const { pushedSplitResponses, newKnowledgePointChain, newThreads, subjects, subjectIntro } = result;
        if (!subjects || !subjectIntro) throw new Error("subjects or subjectIntro is null in getNextMessage @isQ");
        const payload: IMessagesEndpointResponsePayload = {
            newMessages: [newThreads[newThreads.length - 1][0]],
            metadata: {
                lessonID,
                threads: newThreads,
                subjects,
                knowledgePointChain: newKnowledgePointChain,
                currentKnowledgePointIndex: indexToInsertNewKnowlegePoint
            }
        }
        console.log("payload:", payload);
        return payload;
    }
}
