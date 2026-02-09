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

export default async function architectureSummaryController(){
    const openAIApiKey = process.env.OPENAI_API_KEY;

    const llm = new ChatOpenAI({ openAIApiKey });

    //FIX THIS TO BE SMALLER, ALSO FIX IT SO THAT IT DOESNT SAY (NOT SPECIFIED IN PROVIDED CONTEXT)
    const architectureTemplate = `You are a Senior Software Engineer and System Architect.
                                Using the following code Context, generate a comprehensive architecture summary
                                in the following format. If you are missing context just do not list the information we are asking. 
                                We also need html and newlines surrounding specific parts of the 
                                summary. Below is how I have done it to the example, add html around surrounding parts that may need it
                                as well. DO NOT WRAP THE ENTIRE THING AROUND AN HTML TAG, WE JUST NEED THE h2 AND P TAGS REALLY. Everything wrapped in * do 
                                not include it in the final output, this is meant to represent instructions for generating.

                                Context:
                                {context}
                                
                                <h1>Architecture Summary</h1>
                                <h2>System Overview</h2>
                                    *Provide a high-level overview of the system architecture, including:*
                                    <ul>
                                        <li>Main purpose and functionality</li>
                                        <li>Core technologies and frameworks used</li> 
                                        <li>Overall system design pattern (monolithic, microservices, etc.)</li>
                                    </ul>
                                <h2>Component Architecture</h2>
                                    *Break down the system into its main components:*
                                    <ul>
                                        <li>Frontend: Technologies, frameworks, key features</li>
                                        <li>Backend: Technologies, frameworks, main responsibilities</li>
                                        <li>Database: Type, schema overview, data flow</li>
                                        <li>External Services: Any third-party integrations</li>
                                    </ul>
                                <h2>Data Flow</h2>
                                    *Describe how data flows through the system:*
                                    <ul>
                                        <li>Request/response flow</li>
                                        <li>Data processing pipeline</li> 
                                        <li>Storage and retrieval patterns</li>
                                    </ul>
                                <h2>Technology Stack</h2>
                                    *List and explain the key technologies:*
                                    <ul>
                                        <li>Programming languages</li>
                                        <li>Frameworks and libraries</li>
                                        <li>Infrastructure and deployment tools</li>
                                    </ul>
                                
                                <h2>Key Design Patterns</h2>
                                    *Identify and explain the design patterns used:*
                                    <ul>
                                        <li>Architectural patterns</li>
                                        <li>Design patterns in code</li>
                                        <li>Best practices implemented</li>
                                    </ul>
                                <h2>Scalability & Performance</h2>
                                    *Discuss:*
                                    <ul>
                                        <li>Current scalability considerations</li> 
                                        <li>Performance optimizations</li>
                                        <li>Potential bottlenecks or areas for improvement</li>
                                    </ul>
                                <h2>Security Architecture</h2>
                                    *Outline:*
                                    <ul>
                                        <li>Authentication and authorization mechanisms</li> 
                                        <li>Data security measures</li>
                                        <li>API security practices</li>
                                    </ul>
                                
                                Format the output in clear, well-structured markdown with proper headings and bullet points.

`;

    const architecturePrompt = PromptTemplate.fromTemplate(architectureTemplate);

    const chain = RunnableSequence.from([
        {
            context: retriever.pipe(docs => docs.map(d => d.pageContent).join("\n\n"))
        },
        architecturePrompt,
        llm,
        new StringOutputParser()
    ])

    // The architecture summary
    const response = await chain.invoke(`Please generate me a comprehensive architecture summary for the codebase`);

    console.log("Architechture Summary Controller Here")
    
    // res.status(200).json({architectureSummary: response});
    return {summary: response};
}

