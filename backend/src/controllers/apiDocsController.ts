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

export default async function apiDocsController(){
    const openAIApiKey = process.env.OPENAI_API_KEY;

    const llm = new ChatOpenAI({ openAIApiKey });

    const apiDocsTemplate = `You are a Senior Software Engineer and Technical Writer.
                            Using the following code Context, generate comprehensive API documentation
                            in the following format. Below is how I have done it to the example, add html around surrounding parts that may need it
                            as well. DO NOT WRAP THE ENTIRE THING AROUND AN HTML TAG, WE JUST NEED THE h2 AND P TAGS REALLY. Everything wrapped in * do 
                            not include it in the final output, this is meant to represent instructions for generating.

                            Context:
                            {context}
                            
                            <h1>API Documentation</h1>
                            <h2>API Overview</h2>
                                *Provide a brief overview of the API:*
                                <ul>
                                    <li>Base URL</li>
                                    <li>Authentication method</li>
                                    <li>API version (if applicable)</li>
                                    <li>General conventions (request/response formats, error handling)</li>
                                </ul>
                            
                            <h2>Authentication</h2>
                                *Document the authentication mechanism:*
                                <ul>
                                    <li>How to authenticate requests</li>
                                    <li>Token format and usage</li>
                                    <li>Authentication endpoints (if any)</li>
                                    <li>Example authentication flow</li>
                                </ul>
                            
                            <h2>Endpoints</h2>
                                *For each API endpoint, provide:*
                                
                                <b>Endpoint Name</b>
                                
                                <b>Description</b>
                                    <p>Brief description of what this endpoint does</p>
                                
                                <b>HTTP Method & Path</b>
                                    <p>\`[METHOD] /path/to/endpoint\`</p>
                                
                                <b>Request Headers</b>
                                    *Required and optional headers:*
                                    <ul>
                                        <li>Content-Type</li>
                                        <li>Authorization</li>
                                        <li>Other custom headers<l/i>
                                    </ul>
                                
                                <b>Request Parameters</b>
                                    *Path parameters, query parameters, and request body:*
                                    <ul>
                                        <li>Parameter name</li>
                                        <li>Type</li>
                                        <li>Required/Optional</li>
                                        <li>Description</li>
                                        <li>Example values</li>
                                    </ul>
                                
                                <b>Request Body (if applicable)</b>
                                    *Schema and example(add newlines to format it like this):*
                                    <p>
                                        \`\`\`json
                                        {{
                                            "field1": "value1",
                                            "field2": "value2"
                                        }}
                                        \`\`\`
                                    </p>
                                
                                <b>Response</b>
                                    *Success and error responses:*
                                    <ul>
                                        <li>Status codes</li>
                                        <li>Response schema</li>
                                        <li>Example responses</li>
                                    </ul>
                                
                                <b>Example Request</b>
                                    *add newlines if needed to give the example request as formated below*
                                    <p>
                                        \`\`\`bash
                                        curl -X [METHOD] "https://api.example.com/endpoint" \\
                                            -H "Authorization: Bearer token" \\
                                            -H "Content-Type: application/json" \\
                                            -d '{{"key": "value"}}'
                                        \`\`\`
                                    </p>
                                
                                <b>Example Response</b>
                                    *add newlines if needed to give the example response as formated below*
                                    <p>
                                        \`\`\`json
                                        {{
                                            "status": "success",
                                            "data": {{}}
                                        }}
                                        \`\`\`
                                    </p>
                                
                                <b>Error Responses</b>
                                    *Common error scenarios:*
                                    <ul>
                                        <li>Error codes</li>
                                        <li>Error message formats</li>
                                        <li>Troubleshooting tips</li>
                                    </ul>
                            
                            <h2>Error Handling</h2>
                                *Document the error handling approach:*
                                <ul>
                                    <li>Standard error response format</li>
                                    <li>HTTP status codes used</li>
                                    <li>Error code reference</li>
                                    <li>Common error scenarios<l/i>
                                </ul>
                            
                            <h2>Rate Limiting</h2>
                                *If applicable, document:*
                                <ul>
                                    <li>Rate limits</li>
                                    <li>Rate limit headers</li>
                                    <li>How to handle rate limit errors</li>
                                </ul>
                            
                            <h2>Code Examples</h2>
                                *Provide code examples in common languages:*
                                <p>
                                    Any applicable coding language is applied here. Some code examples written here. 
                                </p>
                            
                            Format the output in clear, well-structured markdown with proper code blocks and examples.

`;

    const apiDocsPrompt = PromptTemplate.fromTemplate(apiDocsTemplate);

    const chain = RunnableSequence.from([
        {
            context: retriever.pipe(docs => docs.map(d => d.pageContent).join("\n\n"))
        },
        apiDocsPrompt,
        llm,
        new StringOutputParser()
    ])

    // The API documentation
    const response = await chain.invoke(`Please generate me comprehensive API documentation for the codebase`);

    console.log("API Docs Controller Here")

    return {apidocs: response}
}

