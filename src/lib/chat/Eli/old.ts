'use server'
import OpenAI from "openai";
import { getEmbedding } from "../openai";
//if doesn't work TRY  https://socket.dev/npm/package/@keckelt/tsne
import { knowledgeIndex } from "../pinecone";
import prisma from "../../db/prisma";
//handles rerouting of knowledge chains


export async function saveKnowledgePointsToDBAndPineCone(lessonID: string, knowledgePointChain: any[]) {
    try {
        console.log("savekNowledgePointsToDBAndPineCone called")
        const _kps = await Promise.all(knowledgePointChain.map(async (Kp) => {
            const updatedUser = await prisma.$transaction(async (tx) => {
                const em = await getEmbedding(Kp.pointInSolitude);
                console.log("embedding formed: ", em, "for KpSol: ", Kp.pointInSolitude)
                const lesson = await tx.lesson.findUnique({
                    where: { id: lessonID }
                });
                // if (!userID) return null, if (!metadataId) return null;
                const userID = lesson?.userId;
                if (!userID) {
                    console.error("Either of these retrieved from DB was null:", userID, ": userID")
                    return null
                };
                const K = await tx.knowledgePoint.create({
                    data: {
                        KP: Kp.pointInSolitude,
                        userId: userID,
                        source: Kp.source,
                        TwoDvK: Kp.TwoDCoOrdinates,
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
            if (!updatedUser) return null;
            return updatedUser.knowledgePoints;
        })
        )
        return _kps;
    } catch (e) {
        console.log(e)
        return null;
    }
}

const errorCodes = {
    userIDUndefined: "INTERNAL: The user's ID was undefined.",
    notEnoughExtractableKnowledge: "There wasn't enough extractable knowledge from your reply. Show me what you know!",
    SimplifiedKnowledgePointIsUndefined: "INTERNAL: The simplified knowledge point is undefined.",
}
