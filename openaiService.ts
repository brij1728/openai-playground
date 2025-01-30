import { API_URL, HEADERS, MODEL_TYPE } from "./config.ts";

const createRequestBody = (query: string) => ({
    model: MODEL_TYPE,
    messages: [{ role: "user", content: query }]
});

export const fetchOpenAIResponse = async (query: string) => {
    try {
        const options: RequestInit = {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(createRequestBody(query))
        };

        const response = await fetch(API_URL, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content; 
        
        
        
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};
