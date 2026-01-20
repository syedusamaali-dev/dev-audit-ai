const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Audit = require('../models/Audit');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/review', async (req, res) => {
  try {
    const { code, language } = req.body;

    const prompt = `Analyze the following ${language || 'code'} for security vulnerabilities, performance issues, and clean code refactoring.
    Provide the response strictly in JSON format with these exact keys:
    "vulnerabilities" (array of strings),
    "performanceFixes" (array of strings),
    "refactoredCode" (string),
    "summary" (string).

    Code to analyze:
    ${code}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const aiResult = JSON.parse(completion.choices[0].message.content);

    // Save review to MongoDB
    const newAudit = await Audit.create({
      originalCode: code,
      language,
      ...aiResult,
    });

    res.status(201).json(newAudit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MUST HAVE THIS EXPORT AT THE BOTTOM
module.exports = router;