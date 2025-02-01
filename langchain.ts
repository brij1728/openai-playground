import "https://deno.land/x/dotenv@v3.2.2/load.ts";

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

const systemTemplate = "Translate the following from English into {language}";

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{text}"],
]);

const promptValue = await promptTemplate.invoke({
  language: "hindi",
  text: "hi!",
});


const response = await model.invoke(promptValue);
console.log(`${response.content}`);