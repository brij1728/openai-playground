import { fetchOpenAIResponse } from "./openaiService.ts";

const args = Deno.args;

if (args.length === 0) {
    console.log("Usage: deno run --allow-read --allow-env cli.ts \"your query here\"");
    Deno.exit(1);
}

// Join arguments to form a query string
const userQuery = args.join(" ");

console.log(`\n🔍 Querying OpenAI: "${userQuery}"\n`);

const fetchResponse = async () => {
    const result = await fetchOpenAIResponse(userQuery);
    if (result) {
        console.log("🧠 OpenAI Response:\n");
        console.log(result);
    } else {
        console.log("❌ Failed to get a response from OpenAI.");
    }
};

fetchResponse();
