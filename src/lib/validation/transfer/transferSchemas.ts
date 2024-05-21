import { date, z } from "zod"
import { messagesSchema } from "../primitives";
const stageType = z.enum(['loading', 'purgatory', 'main', 'end']);
export const messagesReceiveSchema = z.object({
    stage: stageType,
    purgDetails: z.object({
        mode: z.enum(['New Question', 'Free Roam']),
        uQ: z.string().optional(),
        uKP: z.string().optional(),
    }).optional(),
    mainDetails: z.object({
        msgHistory: z.array(z.object({
            role: z.enum(['user', 'eli']),
            content: z.string(),
        })),
        targetQuestion: z.string().optional(),
    }).optional(),
    lastSaved: z.string().transform((str) => new Date(str)),
})
export const messagesPayloadSchema = z.object({
    stage: stageType,
    newMessages: z.array(messagesSchema).optional(),
    targetQuestion: z.object({
        point: z.string(),
        TwoDvK: z.array(z.number()),
    }).optional(),
    lastSaved: z.date()
})
//lessonStateSchema is an extension of messagesPayloadSchema, with lessonID: string
export const lessonStatePayloadSchema = messagesPayloadSchema.extend({
    lessonID: z.string()
})
export const createLessonSchema = z.object({
    mode: z.enum(['New Question', 'Free Roam']),
    content: z.string(), //uKp or uQ
})