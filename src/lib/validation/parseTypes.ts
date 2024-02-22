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
    id: z.string(),
    userId: z.string(),
    subject: z.string(),
    messages: z.array(createMessageSchema).optional(),
    knowledgePointsFromLesson: z.array(z.object({
        lessonId: z.string(), point: z.string(), TwoDCoOrd: z.array(z.string()), confidence: z.enum(["wellKnown", "allegedlyUnderstood", "low"])
    })),
    beganAt: z.date(),
    updatedAt: z.date(),
    status: z.enum(["Active", "Completed"]),
})
// export type IUser = {
//     id: string;
//     name: string;
//     username: string;
//     email: string;
//     password: string;
//     lessons: ILesson[];
//     tutorName: string;
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