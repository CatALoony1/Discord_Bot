require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
async function getAIResult(prompt, sysInstruction) {
    console.log('contacting AI');
    let result = null;
    try {
        const genAI = new GoogleGenerativeAI(process.env.AI_API);
        let model = null;
        if ((prompt.toLowerCase.includes('erzeuge') || prompt.toLowerCase.includes('erstelle') || prompt.toLowerCase.includes('generiere')) && prompt.toLowerCase.includes('bild')) {
            model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash-preview-image-generation",
                systemInstruction: sysInstruction,
                config: {
                    maxOutputTokens: 250,
                },
            });
        } else {
            model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: sysInstruction,
                config: {
                    tools: [{ googleSearch: {} }],
                    maxOutputTokens: 250,
                },
            });
        }
        console.log(`AI-Input:${String(prompt)}`);
        result = await model.generateContent(String(prompt));
        console.log(`AI-Result:${result.response.text()}`);
        console.log(result.response.usageMetadata.totalTokenCount);
    } catch (error) {
        console.log(error);
    }
    return result;
}

module.exports = getAIResult;