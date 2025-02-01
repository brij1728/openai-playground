import "https://deno.land/x/dotenv@v3.2.2/load.ts";

import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

// const response = await llm.invoke([{ role: "user", content: "Hi im bob" }]);
// const response2 = await llm.invoke([{ role: "user", content: "Whats my name" }]);
const response3 = await llm.invoke([
  { role: "user", content: "Hi! I'm Bob" },
  { role: "assistant", content: "Hello Bob! How can I assist you today?" },
  { role: "user", content: "What's my name?" },
]);
// console.log("Content:", response.content);
// console.log("Choices:", response);
// console.log("Content:", response2.content);
// console.log("Choices:", response2);
console.log("Content:", response3.content);
console.log("Choices:", response3);
