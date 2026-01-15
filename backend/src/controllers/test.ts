import { ChatOpenAI, tools } from "@langchain/openai";

export default async function test(){const model = new ChatOpenAI({ model: "gpt-4o" });

// Basic usage - generate an image
const response = await model.invoke(
  "Generate an image of a gray tabby cat hugging an otter with an orange scarf",
  { tools: [tools.imageGeneration()] }
);

const toolOutputs = response.additional_kwargs.tool_outputs as Array<any> || [];

// Access the generated image (base64-encoded)
const imageOutput = toolOutputs.find((output: any) => output.type === "image_generation_call");

if (imageOutput?.result) {
  const fs = await import("fs");
  fs.writeFileSync("output.png", Buffer.from(imageOutput.result, "base64"));
}}