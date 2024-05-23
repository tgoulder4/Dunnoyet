import { z } from "zod";
import { messagesSchema } from "../primitives";

export const lessonSchema = z.object({
    id: z.string().optional(),
    stage: z.enum(['purgatory', 'main', 'end']),
    targetQ: z.string(),
    messages: z.array(messagesSchema).optional(),
    beganAt: z.date(),
    endedAt: z.date(),
    userId: z.string(),
})
export const knowledgePointSchema = z.object({
    point: z.string(),
    confidence: z.number(),
})
export const userHomeInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
    experience: z.number(),
    lessons: z.array(lessonSchema).optional(),
    isPremium: z.boolean(),
    knowledgePoints: z.array(knowledgePointSchema)
})