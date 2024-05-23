import { z } from "zod";
import { KPSchema, messagesSchema } from "../primitives";

export const lessonSchema = z.object({
    id: z.string().optional(),
    stage: z.enum(['purgatory', 'main', 'end']),
    targetQ: z.string(),
    messages: z.array(messagesSchema).optional(),
    beganAt: z.coerce.date(),
    endedAt: z.coerce.date(),
    userId: z.string(),
})
export const userHomeInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
    experience: z.number(),
    lessons: z.array(z.object({ id: z.string() })).optional(),
    isPremium: z.boolean(),
    knowledgePoints: z.array(KPSchema)
})