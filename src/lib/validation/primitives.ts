import { date, z } from "zod"
export const KPSchema = z.object({
    point: z.string(),
    confidence: z.number(),
    //twoDvK is an array of length 2
    TwoDvK: z.array(z.number()),
})
export const messagesSchema = z.object({
    role: z.enum(['user', 'eli']),
    content: z.string(),
    eliResponseType: z.enum(['General', 'WhatComesToMind', 'System']),
    KP: KPSchema.optional(),
    metadata: z.object({
        references: z.array(z.string()),
        imageURL: z.string().optional(),
    }).optional(),
    distanceAwayFromFinishingLesson: z.number(),
})