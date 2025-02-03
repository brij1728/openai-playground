import {
  Annotation,
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { MAX_TOKENS, MODEL_NAME, OPENAI_API_KEY } from "./config.ts";

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { countTotalTokens } from "./tokenizer.ts";
import {trimMessages} from "@langchain/core/messages";

//Prompt template for conversation.
export const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
  ],
  ["placeholder", "{messages}"],
]);

//Config for ChatOpenAI instance.
export const llm = new ChatOpenAI({
  model: MODEL_NAME,
  temperature: 0,
  openAIApiKey: OPENAI_API_KEY,
});

//State annotation for the workflow.
export const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  language: Annotation<string>(),
});

//Trimmer function that trims the conversation messages based on a token limit.
export const trimmer = trimMessages({
  maxTokens: MAX_TOKENS,
  strategy: "last",
  tokenCounter: countTotalTokens,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});

//Calls the language model after trimming the messages and filling in the prompt template.

export const callModel = async (state: typeof GraphAnnotation.State) => {
  const trimmedMessages = await trimmer.invoke(state.messages);

  const prompt = await promptTemplate.invoke({
    messages: trimmedMessages,
    language: state.language,
  });

  const response = await llm.invoke(prompt);
  return { messages: [response] };
};

//Workflow to call model.
export const createWorkflow = () => {
  return new StateGraph(GraphAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END)
    .compile({ checkpointer: new MemorySaver() });
};
