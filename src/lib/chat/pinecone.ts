import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from 'dotenv/config'
const apiKey = process.env.PINECONE_API_KEY;
if (!apiKey) throw new Error("No Pinecone API key found");
const pinecone = new Pinecone({ environment: "gcp-starter", apiKey });
export const knowledgeIndex = pinecone.Index("dunnoyet");