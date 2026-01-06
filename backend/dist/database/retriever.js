import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import supabase from "./supabase-client.js";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const openAIApiKey = process.env.OPEN_API_KEY;
const embeddings = new OpenAIEmbeddings({ openAIApiKey });
const client = supabase;
const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'documents',
    queryName: 'match_documents'
});
export const retriever = vectorStore.asRetriever();
