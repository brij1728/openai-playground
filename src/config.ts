import "https://deno.land/x/dotenv@v3.2.2/load.ts";

export const OPENAI_API_KEY : string | undefined = Deno.env.get("OPENAI_API_KEY");

export const MODEL_NAME: string = Deno.env.get("MODEL_NAME") || "gpt-4o-mini";
export const MAX_TOKENS: number = Deno.env.get("MAX_TOKENS")
  ? parseInt(Deno.env.get("MAX_TOKENS") as string)
  : 999_999_999_999; // using very tokens to avoid trimming, may not be supported by all models


