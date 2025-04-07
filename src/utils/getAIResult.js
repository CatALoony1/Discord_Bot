require('dotenv').config();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
async function getAIResult(prompt, sysInstruction) {
    console.log('contacting admin AI');
    const genAI = new GoogleGenerativeAI(process.env.AI_API);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: sysInstruction,
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ],
    });
    console.log(`AI-Input:${String(prompt)}`);
    const result = await model.generateContent(String(prompt));
    console.log(`AI-Result:${result.response.text()}`);
    console.log(result.response.usageMetadata.totalTokenCount);
    return result;
}

module.exports = getAIResult;