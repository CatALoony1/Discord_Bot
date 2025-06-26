require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey: process.env.AI_API });
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function getAIResult(prompt, sysInstruction) {
    console.log('contacting AI');
    let response = null;
    try {
        console.log(`AI-Input:${prompt}`);

        response = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction: sysInstruction,
                tools: [{ googleSearch: {} }],
                maxOutputTokens: 490,
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