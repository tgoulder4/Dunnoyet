import { z } from 'zod';
import { messagesSchema } from './../../../../../lib/validation/primitives';
export function findDistanceUntilLessonEnd(messages: z.infer<typeof messagesSchema>[]): number {
    if (messages.length == 0) return -1;
    for (let i = messages.length - 1; i >= 0; i--) {
        const dist = messages[i].distanceAwayFromFinishingLesson;
        if (dist) {
            return dist;
        }
    }
    return -1;
}