import { date, z } from "zod"
export const KPSchema = z.object({
    KP: z.string(),
    confidence: z.number(),
    //twoDvK is an array of length 2
    TwoDvK: z.array(z.number()),
})
export const noteSchema = z.object({
    content: z.string(),
    id: z.string().optional(),
    lessonID: z.string().optional(),
})
export const messagesSchema = z.object({
    role: z.enum(['user', 'eli']),
    content: z.string(),
    eliResponseType: z.enum(['General', 'WhatComesToMind', 'System']).nullable().optional(),
    KP: KPSchema.nullable().optional(),
    //this is only used for conditional creation of lesson
    KPId: z.string().nullable().optional(),

    metadata: z.object({
        references: z.array(z.string()),
        imageURL: z.string().optional(),
    }).optional(),
    distanceAwayFromFinishingLesson: z.number().nullable().optional(),
})