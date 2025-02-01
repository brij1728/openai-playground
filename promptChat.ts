import "https://deno.land/x/dotenv@v3.2.2/load.ts";

import {
Annotation,
END,
MemorySaver,
MessagesAnnotation,
START,
StateGraph,
} from "@langchain/langgraph";

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { v4 as uuidv4 } from "uuid";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});


const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You talk like a pirate. Answer all questions to the best of your ability.",
  ],
  ["placeholder", "{messages}"],
]);

const promptTemplate2 = ChatPromptTemplate.fromMessages([
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


// Define the function that calls the model
const callModel= async (state: typeof MessagesAnnotation.State) => {
  const prompt = await promptTemplate.invoke(state);
  const response = await llm.invoke(prompt);
  // Update message history with response:
  return { messages: [response] };
};

// Define a new graph
const workflow= new StateGraph(MessagesAnnotation)
  // Define the (single) node in the graph
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add memory
const app = workflow.compile({ checkpointer: new MemorySaver() });
const config = { configurable: { thread_id: uuidv4() } };
const input = [
  {
    role: "user",
    content: "Hi! I'm Jim.",
  },
];
const output = await app.invoke({ messages: input}, config);
//console.log(output.messages[output.messages.length - 1]);

const input2 = [
  {
    role: "user",
    content: "What is my name?",
  },
];
const output2 = await app.invoke({ messages: input2 }, config);
//console.log(output2.messages[output2.messages.length - 1]);


// Define the function that calls the model
const callModel3 = async (state: typeof GraphAnnotation.State) => {
  const prompt = await promptTemplate2.invoke(state);
  const response = await llm.invoke(prompt);
  return { messages: [response] };
};

const workflow3 = new StateGraph(GraphAnnotation)
  .addNode("model", callModel3)
  .addEdge(START, "model")
  .addEdge("model", END);

const app3 = workflow3.compile({ checkpointer: new MemorySaver() });

const config4 = { configurable: { thread_id: uuidv4() } };
const input6 = {
  messages: [
    {
      role: "user",
      content: "Hi im bob",
    },
  ],
  language: "Hindi",
};
const output7 = await app3.invoke(input6, config4);
console.log(output7.messages[output7.messages.length - 1]);