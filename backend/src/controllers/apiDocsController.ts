import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from "url";
import { BaseRetriever } from "@langchain/core/retrievers";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";


const __filename:string = fileURLToPath(import.meta.url)
const __dirname:string = path.dirname(__filename)
dotenv.config({path: path.resolve(__dirname, '../../.env')});

export default async function apiDocsController(retriever: BaseRetriever){
    const openAIApiKey = process.env.OPENAI_API_KEY;

    const llm = new ChatOpenAI({ openAIApiKey });

    const apiDocsTemplate = `You are a Senior Technical Writer producing API documentation for external consumers.
Using the following code context, generate clear, human-readable API documentation.
DO NOT expose internal function names, class names, or implementation details.
Write from the perspective of someone explaining how to USE the API, not how it is built.
Use HTML tags for structure (h1, h2, h3, p, ul, li, b, pre, code). Do NOT wrap the entire output in a single container tag.
Use double curly braces for literal JSON braces in examples.

Context:
{context}

Follow this EXACT structure:

<h1>API Documentation</h1>

<h2>1. Overview</h2>
<p>Provide a concise summary of what this API does, what problem it solves, and the key capabilities it offers. Write 2-3 sentences in plain language.</p>

<h2>2. Intended Audience</h2>
<p>Describe who this documentation is for (e.g. frontend developers integrating with the API, third-party consumers, mobile developers). Keep it to 1-2 sentences.</p>

<h2>3. Base URL</h2>
<p>State the base URL for all API requests. If the base URL differs by environment, list each (e.g. development, production). Present it in a code block:</p>
<pre><code>http://localhost:8000</code></pre>

<h2>4. Authentication</h2>
<p>Explain the authentication method used by this API. Cover:</p>
<ul>
    <li>How to obtain a token (which endpoint, what credentials)</li>
    <li>How to send the token in subsequent requests (header format)</li>
    <li>Token expiration and renewal</li>
    <li>Which endpoints require authentication and which are public</li>
</ul>
<p>Include an example of the Authorization header:</p>
<pre><code>Authorization: Bearer &lt;your_token&gt;</code></pre>

<h2>5. Endpoints</h2>
<p>Document every API endpoint below. For each endpoint, use this repeating block format:</p>

<h3>&lt;METHOD&gt; &lt;PATH&gt;</h3>
<p><b>Description:</b> A plain-language explanation of what this endpoint does and when to use it.</p>
<p><b>Authentication:</b> State whether authentication is required, optional, or not needed.</p>
<p><b>Request</b></p>
<p>If the endpoint accepts a request body, show the fields in a JSON example with descriptions. If it accepts query parameters, list them with their type, whether they are required, and a description. If there is no request body or parameters, write "No request body."</p>
<p><b>Response</b></p>
<p>Show an example JSON response for a successful request. Include the HTTP status code. If the endpoint returns different responses for different scenarios (e.g. success vs. invalid credentials), show each with its status code.</p>

<h2>6. Error Handling</h2>
<p>Describe the standard error response format used across the API. List the HTTP status codes consumers can expect and what each means in context. Include an example error response:</p>
<pre><code>{{
    "message": "Description of what went wrong"
}}</code></pre>
<p>Provide a table or list of common status codes:</p>
<ul>
    <li><b>400</b> - Bad request (missing or invalid parameters)</li>
    <li><b>401</b> - Authentication required or credentials invalid</li>
    <li><b>403</b> - Token is invalid or expired</li>
    <li><b>404</b> - Endpoint not found</li>
    <li><b>500</b> - Internal server error</li>
</ul>

<h2>7. Rate Limits</h2>
<p>If the API enforces rate limits, document the limits, the headers returned, and how to handle rate-limit errors. If no rate limiting is implemented, state: "This API does not currently enforce rate limits."</p>

<h2>8. Versioning</h2>
<p>Describe the API versioning strategy (e.g. URL path versioning, header-based). If no versioning is in place, state: "This API is not currently versioned. All requests use the latest available version."</p>

<h2>9. Changelog</h2>
<p>If version history is available from the code context, list changes by version or date. If no changelog is available, state: "No changelog is currently maintained. Check the project repository for commit history."</p>
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

    // console.log("API Docs Controller Here")
    // console.log("API Docs Response:", response)

    return {apidocs: response}
}

