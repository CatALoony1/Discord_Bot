require('dotenv').config();
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
async function getAIResult(prompt, sysInstruction) {
    console.log('contacting AI');
    let result = null;
    try {
        const genAI = new GoogleGenerativeAI(process.env.AI_API);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: sysInstruction,
            config: {
                tools: [{googleSearch: {}}],
                maxOutputTokens: 250,
              },
        });
        console.log(`AI-Input:${String(prompt)}`);
        result = await model.generateContent(String(prompt));
        for (const part of result.response.candidates[0].content.parts) {
            console.log(part);
            if (part.text) {
              console.log(part.text);
            } else if (part.inlineData) {
              const imageData = part.inlineData.data;
              const buffer = Buffer.from(imageData, "base64");
              fs.writeFileSync("gemini-native-image.png", buffer);
              console.log("Image saved as gemini-native-image.png");
            }
          }
        console.log(`AI-Result:${result.response.text()}`);
        console.log(result.response.usageMetadata.totalTokenCount);
    } catch (error) {
        console.log(error);
    }
    return result;
}

module.exports = getAIResult;