import { z } from "zod";
import { messagesSchema } from "../primitives";

export const lessonSchema = {
    id: z.string().optional(),
    stage: z.enum(['purgatory', 'main', 'end']),
    targetQ: z.string(),
    messages: z.array(messagesSchema).optional(),
    beganAt: z.date(),
    endedAt: z.date(),
    userId: z.string(),
}