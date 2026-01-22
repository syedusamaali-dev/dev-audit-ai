const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function checkModels() {
  try {
    const response = await ai.models.list();
    console.log("AVAILABLE MODELS FOR YOUR KEY:");
    for await (const model of response) {
      if (model.supportedGenerationMethods?.includes('generateContent')) {
        console.log("-", model.name);
      }
    }
  } catch (err) {
    console.error("Error listing models:", err.message);
  }
}

checkModels();