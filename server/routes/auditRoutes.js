const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const Audit = require('../models/Audit');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/review', async (req, res) => {
  try {
    const { code, language } = req.body;

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        vulnerabilities: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        performanceFixes: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        refactoredCode: { type: SchemaType.STRING },
        summary: { type: SchemaType.STRING },
      },
      required: ['vulnerabilities', 'performanceFixes', 'refactoredCode', 'summary'],
    };

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const prompt = `Analyze the following ${language || 'code'} for security vulnerabilities, performance issues, and clean code refactoring:\n\n${code}`;

    const result = await model.generateContent(prompt);
    const aiResult = JSON.parse(result.response.text());

    const newAudit = await Audit.create({
      originalCode: code,
      language,
      ...aiResult,
    });

    res.status(201).json(newAudit);
  } catch (error) {
    console.error('Gemini Audit Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;