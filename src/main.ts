import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

import { countTotalTokens } from "./tokenizer.ts";
import { createWorkflow } from "./llmService.ts";
import { v4 as uuidv4 } from "uuid";

const app = createWorkflow();

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


const executeConversation = async (additionalMessage: string, language = "English") => {
  // Use a new thread_id for each conversation round.
  const config = { configurable: { thread_id: uuidv4() } };

  // Append the additional message to the conversation.
  const input = {
    messages: [...messages, new HumanMessage(additionalMessage)],
    language,
  };

  console.log("Total tokens for current messages:", countTotalTokens(input.messages));

  const output = await app.invoke(input, config);
  console.log("Model response:", output.messages[output.messages.length - 1].content);
}

// Execute two separate conversation rounds.
await executeConversation("What is my name?");
await executeConversation("What math problem did I ask?");
