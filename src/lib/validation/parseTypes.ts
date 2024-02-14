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
    placeHolderText: z.string().optional()
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
    subject: z.string(),
    messages: z.array(createMessageSchema),
    beganAt: z.string(),
    updatedAt: z.string(),
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
    lessons: z.array(createLessonSchema),
    tutorName: z.string(),
    knowledgePointsUnderstood: z.array(z.string())
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
    uiDetailId: z.string().optional()
})
// export type IDetail = {
//     id?: string;
//     tips: ITip[];
// }