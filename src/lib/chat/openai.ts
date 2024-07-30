import 'dotenv/config'
import OpenAI from "openai";
// console.log("Process.env: ", process.env)
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("No OpenAI API key found");
const openai = new OpenAI({ apiKey });
export default openai;

export async function getEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text
    })
    const embedding = response.data[0].embedding;
    console.log("Created embedding: ", embedding)
    if (!embedding) throw new Error("No embedding found in response")
    return embedding;
}