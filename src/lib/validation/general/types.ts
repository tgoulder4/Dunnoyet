import { z } from "zod";

export const lessonSchema = {
    id: z.string().optional(),
    stage: z.enum(['purgatory', 'main', 'end']),
    targetQ: z.string(),
    beganAt: z.date(),
    endedAt: z.date(),
    userId: z.string(),
}