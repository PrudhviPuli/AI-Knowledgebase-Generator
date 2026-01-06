import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from "url";
import { retriever } from "../database/retriever.js";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const __filename:string = fileURLToPath(import.meta.url)
const __dirname:string = path.dirname(__filename)
dotenv.config({path: path.resolve(__dirname, '../../.env')});

export default async function testController(){
    const openAIApiKey = process.env.OPEN_API_KEY;

    const llm = new ChatOpenAI({ openAIApiKey });

    const testingTemplate = `You are a Senior Software Engineer
                            Using the following code Context, give us information based on what is asked.

                            Context:
                            {context}
                            
                            Information: `;
    
    const testPrompt = PromptTemplate.fromTemplate(testingTemplate);

    const chain = RunnableSequence.from([
        {
            context: retriever.pipe(docs => docs.map(d => d.pageContent).join("\n\n"))
        },
        testPrompt,
        llm,
        new StringOutputParser()
    ])

    const response = await chain.invoke(`What language is this code written in?`);

    console.log(response);
}





