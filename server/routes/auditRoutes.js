const express = require('express');
const router = express.Router();
const { GoogleGenAI, Type } = require('@google/genai');
const Audit = require('../models/Audit');
const connectDB = require('../config/db'); // Import connection helper

// Helper function to handle 503 high demand retries
async function generateWithRetry(ai, params, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      const is503 = error.message && error.message.includes('503');
      if (is503 && i < retries - 1) {
        console.warn(`Gemini 503 High Demand - Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
}

router.post('/review', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code content is required for auditing.' });
    }

    // 1. Ensure DB Connection is fully established before running queries
    await connectDB();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing in environment variables.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze the following ${language || 'code'} for security vulnerabilities, performance issues, and clean code refactoring principles:`;

    const response = await generateWithRetry(ai, {
      model: 'gemini-3.6-flash',
      contents: [prompt, code],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vulnerabilities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            performanceFixes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            refactoredCode: { type: Type.STRING },
            summary: { type: Type.STRING },
          },
          required: ['vulnerabilities', 'performanceFixes', 'refactoredCode', 'summary'],
        },
      },
    });

    const aiResult = JSON.parse(response.text);

    // 2. Save to MongoDB Atlas
    const newAudit = await Audit.create({
      originalCode: code,
      language: language || 'javascript',
      ...aiResult,
    });

    res.status(201).json(newAudit);
  } catch (error) {
    console.error('Audit Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;