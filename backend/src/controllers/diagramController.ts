import { ChatOpenAI, tools } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from "url";
import { retriever } from "../database/retriever.js";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { OpenAI } from "openai";
import fs from 'fs'

const __filename:string = fileURLToPath(import.meta.url)
const __dirname:string = path.dirname(__filename)
dotenv.config({path: path.resolve(__dirname, '../../.env')});

export default async function diagramController(){
    const openAIApiKey = process.env.OPEN_API_KEY;

    const llm = new ChatOpenAI({ openAIApiKey });
    const openai = new OpenAI({apiKey: openAIApiKey});

    const testingTemplate = `You are a Senior Software Engineer
                            Using the following code Context, generate me a prompt that will
                            help this AI model generate an image of an architechture diagram.

                            Use this DNA template for formating:
                            Diagram DNA TEMPLATE

                            # Styling (MUST maintain across ALL images)
                            - Box: simple box surrounding each main part
                            - Text: simple black text  
                            - Arrows: black arrows that connect from one box and point to the next
                            - Color: Simple black text/boxes/lines, white background
                            - Font: basic default font

                            # Consistent Elements (MUST maintain across ALL images)
                            - Using Text for each main data

                            The architechture diagram can just consist of the main data flow such
                            as frontend, backend, database, or more as needed. It also needs to consist of what 
                            frameworks its using and languages. The prompt needs to design the architechture diagram 
                            similar to a flow chart or system design chart. For example:

                            Frontend -> API -> Backend -> Database

                            Context:
                            {context}

                            Prompt:

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

    const prompt = await chain.invoke(`Please generate me an architechture diagram for the codebase`);

    // console.log(typeof prompt)

    const result = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
    });

    console.log("Successfully Generated Image")

    if (!result.data || result.data.length === 0) {
        throw new Error("No image data returned from OpenAI");
    }
    
    // Save the image to a file
    const image_base64 = result.data[0].b64_json;

    if (!image_base64) {
        throw new Error("Image base64 data missing");
    }

    const image_bytes = Buffer.from(image_base64, "base64");
    fs.writeFileSync("diagram.png", image_bytes);
    //this is where the image is generated, writing it to directory for now

}





