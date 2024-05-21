import { date, z } from "zod"
import { messagesSchema } from "../primitives";
const stageType = z.enum(['loading', 'purgatory', 'main', 'end']);
export const roleType = z.enum(['user', 'eli']);
const modeType = z.enum(['New Question', 'Free Roam']);
export const messagesReceiveSchema = z.object({
    stage: stageType,
    purgDetails: z.object({
        mode: modeType,
        uQ: z.string().optional(),
        uKP: z.string().optional(),
    }).optional(),
    mainDetails: z.object({
        msgHistory: z.array(z.object({
            role: roleType,
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
    subject: z.string().optional(),
    lastSaved: z.date()
})
//lessonStateSchema is an extension of messagesPayloadSchema, with lessonID: string
export const lessonStatePayloadSchema = messagesPayloadSchema.extend({
    lessonID: z.string(),
    subject: z.string().optional()
})
export const createLessonSchema = z.object({
    mode: modeType,
    content: z.string(), //uKp or uQ
})