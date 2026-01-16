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
    const openAIApiKey = process.env.OPEN_API_KEY;

    const llm = new ChatOpenAI({ openAIApiKey });

    const architectureTemplate = `You are a Senior Software Engineer and System Architect.
                                Using the following code Context, generate a comprehensive architecture summary
                                in the following format.

                                Context:
                                {context}
                                
                                Architecture Summary:
                                
                                # System Overview
                                    Provide a high-level overview of the system architecture, including:
                                    - Main purpose and functionality
                                    - Core technologies and frameworks used
                                    - Overall system design pattern (monolithic, microservices, etc.)
                                
                                # Component Architecture
                                    Break down the system into its main components:
                                    - Frontend: Technologies, frameworks, key features
                                    - Backend: Technologies, frameworks, main responsibilities
                                    - Database: Type, schema overview, data flow
                                    - External Services: Any third-party integrations
                                
                                # Data Flow
                                    Describe how data flows through the system:
                                    - Request/response flow
                                    - Data processing pipeline
                                    - Storage and retrieval patterns
                                
                                # Technology Stack
                                    List and explain the key technologies:
                                    - Programming languages
                                    - Frameworks and libraries
                                    - Infrastructure and deployment tools
                                
                                # Key Design Patterns
                                    Identify and explain the design patterns used:
                                    - Architectural patterns
                                    - Design patterns in code
                                    - Best practices implemented
                                
                                # Scalability & Performance
                                    Discuss:
                                    - Current scalability considerations
                                    - Performance optimizations
                                    - Potential bottlenecks or areas for improvement
                                
                                # Security Architecture
                                    Outline:
                                    - Authentication and authorization mechanisms
                                    - Data security measures
                                    - API security practices
                                
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

    console.log(response);
    return response;
}

