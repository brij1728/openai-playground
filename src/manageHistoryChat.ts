import "https://deno.land/x/dotenv@v3.2.2/load.ts";

import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  trimMessages,
} from "@langchain/core/messages";
import {
Annotation,
END,
MemorySaver,
MessagesAnnotation,
START,
StateGraph,
} from "@langchain/langgraph";
import { TiktokenModel, encoding_for_model } from "tiktoken"; // or another tokenizer library

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { OPENAI_API_KEY } from "./config.ts";
import { v4 as uuidv4 } from "uuid";

const MODEL_NAME = Deno.env.get("MODEL_NAME") || "gpt-4o-mini";
const MAX_TOKENS = Deno.env.get("MAX_TOKENS") ? parseInt(Deno.env.get("MAX_TOKENS") as string) : 999_999_999_999 ; // using very tokens to avoid trimming, may not be supported by all models

const llm = new ChatOpenAI({
  model: MODEL_NAME,
  temperature: 0,
  openAIApiKey: OPENAI_API_KEY,

});




const promptTemplate = ChatPromptTemplate.fromMessages([
  [
	"system",
	"You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
  ],
  ["placeholder", "{messages}"],
]);

// Define the State
const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  language: Annotation<string>(),
});


const trimmer = trimMessages({
  maxTokens: MAX_TOKENS,
  strategy: "last",
  tokenCounter: countTotalTokens,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});




const callModel = async (state: typeof GraphAnnotation.State) => {
  const trimmedMessage = await trimmer.invoke(state.messages);
  const prompt = await promptTemplate.invoke({
    messages: trimmedMessage,
    language: state.language,
  });
  const response = await llm.invoke(prompt);
  
  return { messages: [response] };
};

function countTokensForMessage(message: string): number {
  const encoder = encoding_for_model(MODEL_NAME as TiktokenModel); 
  const tokens = encoder.encode(message);
  return tokens.length;
}

function countTotalTokens(messages: BaseMessage[]): number {
  return messages.reduce((total, msg) => total + countTokensForMessage(msg.content as string), 0);
}


const workflow = new StateGraph(GraphAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const app = workflow.compile({ checkpointer: new MemorySaver() });

const config = { configurable: { thread_id: uuidv4() } };

const messages = [
  new SystemMessage("you're a good assistant"),
  new HumanMessage("hi! My name is Bob. I live in Varanasi."),
  new AIMessage("hi! Bob. I heard very good thing about Varanasi. Tell more about yourself."),
  new HumanMessage("I like vanilla ice cream"),
  new AIMessage("nice. How can i help you today?"),
  new HumanMessage("whats 2 + 2"),
  new AIMessage("4"),
  new HumanMessage("thanks"),
  new AIMessage("no problem!"),
  new HumanMessage("having fun?"),
  new AIMessage("yes!"),
];


const input = {
  messages: [...messages, new HumanMessage("What is my name?")],
  language: "English",
};
console.log("Total tokens for current messages:", countTotalTokens(input.messages));

const output = await app.invoke(input, config);
console.log(output.messages[output.messages.length - 1].content);

const config2 = { configurable: { thread_id: uuidv4() } };
const input2 = {
  messages: [...messages, new HumanMessage("What math problem did I ask?")],
  language: "English",
};


const output10 = await app.invoke(input2, config2);
console.log(output10.messages[output10.messages.length - 1].content);