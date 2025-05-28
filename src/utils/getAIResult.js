require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");
async function getAIResult(prompt, sysInstruction) {
    console.log('contacting AI');
    let response = null;
    try {
        const genAI = new GoogleGenAI({ apiKey: process.env.AI_API });
        console.log(`AI-Input:${String(prompt)}`);
        response = await genAI.models.generateContent({
            //model: "gemini-2.0-flash",
            model: "gemini-2.5-flash-preview-05-20",
            contents: String(prompt),
            config: {
                systemInstruction: sysInstruction,
                tools: [{ googleSearch: {} }],
                maxOutputTokens: 250,
            },
        });
        console.log(`AI-Result:${response.text}`);
        console.log(response.usageMetadata.totalTokenCount);
    } catch (error) {
        console.log(error);
    }
    return response;
}

module.exports = getAIResult;