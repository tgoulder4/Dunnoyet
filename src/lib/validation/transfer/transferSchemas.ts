import { date, z } from "zod"
import { messagesSchema } from "../primitives";
const stageType = z.enum(['loading', 'purgatory', 'main', 'end']);
export const roleType = z.enum(['user', 'eli']);
const modeType = z.enum(['New Question', 'Free Roam']);
export const actionType = z.enum(['reply', 'understood']);
//the client sends this to the server
export const messagesReceiveSchema = z.object({
    stage: stageType,
    msgHistory: z.array(messagesSchema),
    targetQuestion: z.string().optional(),
    subject: z.string().optional(),
    lessonId: z.string().optional(),
    userId: z.string().optional(),
    action: actionType.optional(),
    lastSaved: z.coerce.date().optional(),
})

//the server sends this to the client
export const messagesPayloadSchema = z.object({
    stage: stageType,
    newMessages: z.array(messagesSchema).optional(),
    targetQuestion: z.object({
        point: z.string(),
        TwoDvK: z.array(z.number()),
    }).optional(),
    subject: z.string().optional(),
    lastSaved: z.coerce.date().optional(),
    //only used for ending the lesson
    experiencePrior: z.number().optional()
})
//lessonStateSchema is an extension of messagesPayloadSchema, with lessonID: string
export const lessonStatePayloadSchema = messagesPayloadSchema.extend({
    lessonID: z.string().optional(),
    subject: z.string().optional(),
    userID: z.string().optional()
})
export const lessonStateSchema = lessonStatePayloadSchema.extend({
    msgHistory: z.array(messagesSchema),
})
export const createLessonSchema = z.object({
    mode: modeType,
    content: z.string(), //uKp or uQ
})