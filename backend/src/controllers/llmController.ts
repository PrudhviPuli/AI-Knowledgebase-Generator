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
                            Using the following code Context, give us an onboarding guide in the following
                            format.

                            Context:
                            {context}
                            
                            Introduction:
                                Short Paragraph introducing users to the codebase. Gives the name of the codebase,
                                what tech stacks we are using, purpose of the codebase, goal of the codebase
                                
                            Explanation: 
                                Short paragraph that goes more in depth of what the codebase does, the problem it 
                                is solving perhaps, what it does, main features of the code, main uses such as mainly 
                                using AI to answer questions, how the code connects together overall(frontend does this,
                                backend does that, techstacks)
                            
                            Environment Setup:
                                Instructions for setting up the codebase for your own use. How to install, clone,
                                dependencies, packages, starting it up for personal use.

`;
    
    const testPrompt = PromptTemplate.fromTemplate(testingTemplate);

    const chain = RunnableSequence.from([
        {
            context: retriever.pipe(docs => docs.map(d => d.pageContent).join("\n\n"))
        },
        testPrompt,
        llm,
        new StringOutputParser()
    ])

    const response = await chain.invoke(`Please generate me an onboarding guide for the codebase`);

    console.log(response);
}





