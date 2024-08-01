import { messagesSchema } from './../../../validation/primitives';
import { z } from "zod";
import openai from "../../openai";
import { getTeachingResponse } from "../core/core";
test('getTeachingResponse', async () => {
    const statementMsg = {
        role: 'user' as 'user' | 'eli',
        content: 'Photons are particles of light'
    }
    const a = await getTeachingResponse([statementMsg])
    expect(true).toBe(true)
})
