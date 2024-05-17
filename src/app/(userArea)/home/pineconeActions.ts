import { getEmbedding } from "@/lib/chat/openai";

export async function getEmbeddingForKnowledgeBase(newKnowledgePoints: string[]) {
    // return getEmbedding(knowledge);
    return newKnowledgePoints.map((point) => getEmbedding(point));
}