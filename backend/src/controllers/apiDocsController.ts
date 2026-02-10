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
    const openAIApiKey = process.env.OPEN_API_KEY;

    const llm = new ChatOpenAI({ openAIApiKey });

    const apiDocsTemplate = `You are a Senior Software Engineer and Technical Writer.
                            Using the following code Context, generate comprehensive API documentation
                            in the following format.

                            Context:
                            {context}
                            
                            API Documentation:
                            
                            # API Overview
                                Provide a brief overview of the API:
                                - Base URL
                                - Authentication method
                                - API version (if applicable)
                                - General conventions (request/response formats, error handling)
                            
                            # Authentication
                                Document the authentication mechanism:
                                - How to authenticate requests
                                - Token format and usage
                                - Authentication endpoints (if any)
                                - Example authentication flow
                            
                            # Endpoints
                                For each API endpoint, provide:
                                
                                ## [Endpoint Name]
                                
                                ### Description
                                    Brief description of what this endpoint does
                                
                                ### HTTP Method & Path
                                    \`[METHOD] /path/to/endpoint\`
                                
                                ### Request Headers
                                    Required and optional headers:
                                    - Content-Type
                                    - Authorization
                                    - Other custom headers
                                
                                ### Request Parameters
                                    Path parameters, query parameters, and request body:
                                    - Parameter name
                                    - Type
                                    - Required/Optional
                                    - Description
                                    - Example values
                                
                                ### Request Body (if applicable)
                                    Schema and example:
                                    \`\`\`json
                                    {{
                                        "field1": "value1",
                                        "field2": "value2"
                                    }}
                                    \`\`\`
                                
                                ### Response
                                    Success and error responses:
                                    - Status codes
                                    - Response schema
                                    - Example responses
                                
                                ### Example Request
                                    \`\`\`bash
                                    curl -X [METHOD] "https://api.example.com/endpoint" \\
                                        -H "Authorization: Bearer token" \\
                                        -H "Content-Type: application/json" \\
                                        -d '{{"key": "value"}}'
                                    \`\`\`
                                
                                ### Example Response
                                    \`\`\`json
                                    {{
                                        "status": "success",
                                        "data": {{}}
                                    }}
                                    \`\`\`
                                
                                ### Error Responses
                                    Common error scenarios:
                                    - Error codes
                                    - Error message formats
                                    - Troubleshooting tips
                            
                            # Error Handling
                                Document the error handling approach:
                                - Standard error response format
                                - HTTP status codes used
                                - Error code reference
                                - Common error scenarios
                            
                            # Rate Limiting
                                If applicable, document:
                                - Rate limits
                                - Rate limit headers
                                - How to handle rate limit errors
                            
                            # Code Examples
                                Provide code examples in common languages:
                                - JavaScript/TypeScript
                                - Python
                                - cURL
                            
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
    console.log("API Docs Response:", response)

    return {apidocs: response}
}

