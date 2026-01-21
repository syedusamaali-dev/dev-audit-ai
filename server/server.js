const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({ origin: 'http://localhost:5173' })); // Allows React Vite frontend
app.use(express.json());

// Initialize Gemini SDK with API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// GET Route: Fetch available models
app.get('/api/gemini/models', async (req, res) => {
  try {
    const response = await ai.models.list();

    let modelList = [];

    // Safely parse array/iterable returned by SDK
    if (Array.isArray(response)) {
      modelList = response;
    } else if (response && response.models && Array.isArray(response.models)) {
      modelList = response.models;
    } else if (
      response &&
      (typeof response[Symbol.asyncIterator] === 'function' ||
        typeof response[Symbol.iterator] === 'function')
    ) {
      for await (const model of response) {
        modelList.push(model);
      }
    }

    res.status(200).json({ success: true, models: modelList });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST Route: Sample content generation endpoint
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const response = await ai.models.generateContent({
      model: model || 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({ success: true, text: response.text });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`CommonJS Express Server running on http://localhost:${PORT}`);
});