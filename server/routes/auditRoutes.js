const express = require('express');
const router = express.Router();
const { GoogleGenAI, Type } = require('@google/genai');
const Audit = require('../models/Audit');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/review', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code content is required for auditing.' });
    }

    const prompt = `Analyze the following ${language || 'code'} for security vulnerabilities, performance issues, and clean code refactoring principles:`;

    const response = await ai.models.generateContent({
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

    // Save to MongoDB Atlas
    const newAudit = await Audit.create({
      originalCode: code,
      language: language || 'javascript',
      ...aiResult,
    });

    res.status(201).json(newAudit);
  } catch (error) {
    console.error('Gemini Audit Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;