import "https://deno.land/x/dotenv@v3.2.2/load.ts";

// OpenAI API Configuration
export const BASE_URL: string = "https://api.openai.com/v1/chat/completions";
export const API_KEY: string | undefined = Deno.env.get("OPENAI_API_KEY");
export const PROJECT_ID: string | undefined = Deno.env.get("OPENAI_PROJECT_ID");
export const MODEL_TYPE: string = "gpt-4o-mini";

if (!API_KEY) {
    throw new Error("Missing OpenAI API Key. Set OPENAI_API_KEY in environment variables.");
}

export const API_URL: string = PROJECT_ID ? `${BASE_URL}?project=${PROJECT_ID}` : BASE_URL;

export const HEADERS: Record<string, string> = {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
};

if (PROJECT_ID) {
    HEADERS["OpenAI-Project"] = PROJECT_ID;
}
