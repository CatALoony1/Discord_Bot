require('dotenv').config();
const { GoogleGenAI, Modality } = require("@google/genai");
async function getAIResult(prompt, sysInstruction) {
    console.log('contacting AI');
    let result = null;
    try {
        const genAI = new GoogleGenAI({ apiKey: process.env.AI_API });
        let model = null;
        let response = null;
        console.log(`AI-Input:${String(prompt)}`);
        if ((prompt.toLowerCase().includes('erzeuge') || prompt.toLowerCase().includes('erstelle') || prompt.toLowerCase().includes('generiere')) && prompt.toLowerCase().includes('bild')) {
            response = await ai.models.generateContent({
                model: "gemini-2.0-flash-preview-image-generation",
                contents: String(prompt),
                systemInstruction: sysInstruction,
                config: {
                    maxOutputTokens: 250,
                    responseModalities: [Modality.TEXT, Modality.IMAGE],
                },
            });
        } else {
            response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: String(prompt),
                systemInstruction: sysInstruction,
                config: {
                    tools: [{ googleSearch: {} }],
                    maxOutputTokens: 250,
                },
            });
        }
        console.log(`AI-Result:${response.text()}`);
        console.log(response.usageMetadata.totalTokenCount);
    } catch (error) {
        console.log(error);
    }
    return response;
}

module.exports = getAIResult;