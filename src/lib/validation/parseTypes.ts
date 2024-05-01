import { IKnowledge } from './enforceTypes';
import { z } from 'zod'
// //TYPES
// export type IMessage = {
//     content: string;
//     role: "User" | "Assistant";
//     type: "New_Question" | "Question" | "Response" | "Interrogation";
//     placeHolderText?: string;
// };
export const createMessageSchema = z.object({
    content: z.string(),
    role: z.enum(["User", "Assistant"]),
    type: z.enum(["New_Question", "Question", "Response", "Interrogation"]),
    lessonId: z.string()
})
// export type ILesson = {
//     id: string,
//     subject: string;
//     messages: IMessage[]
//     beganAt: string;
//     updatedAt: string;
//     userId: string;
// }
export const createLessonSchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    subjects: z.array(z.string()),
    messages: z.array(createMessageSchema).optional(),
    updatedAt: z.string().optional(),
    knowledgePointsFromLesson: z.array(z.object({
        lessonId: z.string(), pointInSolitude: z.string(), pointInChain: z.string(), source: z.enum(["reinforced", "offered"]), userId: z.string(), TwoDCoOrdinates: z.array(z.number()), confidence: z.number()
    })),
})
const ISplitResponseSchema = z.object({
    text: z.string(),
    active: z.boolean()
});

const IKnowledgeSchema = z.object({
    id: z.string().optional(),
    lessonId: z.string().optional(),
    userId: z.string().optional(),
    source: z.enum(['reinforced', 'offered']),
    pointInSolitude: z.string(),
    pointInChain: z.string(),
    TwoDCoOrdinates: z.array(z.number()),
    vectorEmbedding: z.array(z.number()),
    confidence: z.number()
});
const IMessageSchema = z.object({
    id: z.string().optional(),
    content: z.string().optional(),
    splitResponse: ISplitResponseSchema.optional(),
    eliResponseType: z.enum(["General", "WhatComesToMind", "ChallengeQ", "System"]).optional(),
    role: z.enum(["user", "eli"]),
    placeHolderText: z.string().optional()
});
export const putLessonSchema = z.object({
    messages: z.array(z.object({
        id: z.string().optional(),
        content: z.string().optional(),
        splitResponse: ISplitResponseSchema.optional(),
        eliResponseType: z.enum(["General", "WhatComesToMind", "ChallengeQ", "System"]).optional(),
        role: z.enum(["user", "eli"]),
        placeHolderText: z.string().optional()
    })),
    metadata: z.object({
        metadataId: z.string().optional(),
        lessonID: z.string(),
        threads: z.array(z.array(IMessageSchema)),
        subjects: z.array(z.string()),
        action: z.optional(z.enum(["UNDERSTOOD", "ENDLESSON"])),
        knowledgePointChain: z.array(IKnowledgeSchema),
        currentKnowledgePointIndex: z.number(),
        errorWithTheirInput: z.string().optional()
    })
} || { newQuestion: z.string() });
// export type IUser = {
//     id: string;
//     name: string;
//     username: string;
//     email: string;
//     password: string;
//     lessons: ILesson[];
//     knowledgePointsUnderstood: string[];
// };
export const createUserSchema = z.object({
    name: z.string(),
    username: z.string(),
    email: z.string(),
    password: z.string(),
})
// export type ITip = {

//     id?: string;
//     title: string;
//     content: string;
//     link: string;
//     uiDetailId?: string;
// }
export const createTipSchema = z.object({
    title: z.string(),
    content: z.string(),
    link: z.string(),
})
// export type IDetail = {
//     id?: string;
//     tips: ITip[];
// }