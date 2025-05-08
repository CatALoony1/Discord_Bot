require('dotenv').config();
const { GoogleGenAI/*, Modality*/ } = require("@google/genai");
async function getAIResult(prompt, sysInstruction, image) {
    console.log('contacting AI');
    let response = null;
    try {
        const genAI = new GoogleGenAI({ apiKey: process.env.AI_API });
        console.log(`AI-Input:${String(prompt)}`);
        /*if (image) {
            response = await genAI.models.generateContent({
                model: "gemini-2.0-flash-preview-image-generation",
                contents: String(prompt),
                config: {
                    systemInstruction: sysInstruction,
                    maxOutputTokens: 250,
                    responseModalities: [Modality.TEXT, Modality.IMAGE],
                },
            });
        } else {*/
            response = await genAI.models.generateContent({
                model: "gemini-2.0-flash",
                contents: String(prompt),
                config: {
                    systemInstruction: sysInstruction,
                    tools: [{ googleSearch: {} }],
                    maxOutputTokens: 250,
                },
            });
        //}
        console.log(`AI-Result:${response.text()}`);
        console.log(response.usageMetadata.totalTokenCount);
    } catch (error) {
        console.log(error);
    }
    return response;
}

module.exports = getAIResult;