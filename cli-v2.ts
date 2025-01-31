import "https://deno.land/x/dotenv@v3.2.2/load.ts";

import { OpenAI } from "https://deno.land/x/openai@v4.68.1/mod.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!,
});
const userPrompt = "What are some cool things to do in fall?";
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini", // Specify the GPT-4 (or any other valid) model for the completion
  messages: [
    { role: "system", content: "You are a helpful assistant." }, // System message setting the role
    { role: "user", content: userPrompt }, // User's input prompt
  ],
});
console.log("Response from OpenAI:", completion.choices[0].message.content);