import { TiktokenModel, encoding_for_model } from "tiktoken";

import { BaseMessage } from "@langchain/core/messages";
import { MODEL_NAME } from "./config.ts";

//Counts the number of tokens for a given message string using the model's encoder.
export const countTokensForMessage = (message: string): number => {
  const encoder = encoding_for_model(MODEL_NAME as TiktokenModel);
  const tokens = encoder.encode(message);
  return tokens.length;
}

//Counts the total number of tokens in an array of messages.
export const countTotalTokens = (messages: BaseMessage[]): number => {
  return messages.reduce(
    (total, msg) => total + countTokensForMessage(msg.content as string),
    0
  );
}
