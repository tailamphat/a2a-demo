import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Agent Card endpoint
app.get('/.well-known/agent.json', (req, res) => {
  res.json({
    name: 'Blog Translator Agent',
    description:
      "An AI agent that translates blog content to Vietnamese while maintaining the original meaning, style, and tone using Google's Gemini model.",
    url: 'http://localhost:8001',
    version: '1.0.0',
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    defaultInputModes: ['text', 'text/plain'],
    defaultOutputModes: ['text', 'text/plain'],
    skills: [
      {
        id: 'blog_translation',
        name: 'blog-translation',
        description: 'Translates blog content to Vietnamese',
      },
    ],
  });
});

// A2A Protocol handler
app.post('/', async (req, res) => {
  try {
    console.log('Received request:', JSON.stringify(req.body, null, 2));
    const { jsonrpc, method, params, id } = req.body;

    // Validate request method
    if (method !== 'tasks/send') {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32601,
          message: 'Method not found',
        },
        id,
      });
    }

    // Extract content from params
    let { topic: content } = params;
    content = content ?? params.message?.parts?.[0]?.text;

    console.log('Request params:', JSON.stringify(params, null, 2));
    console.log('Extracted content:', content);

    if (!content) {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32602,
          message: 'Missing required parameter: content',
        },
        id,
      });
    }

    // Generate translation
    const prompt = `You are a professional translator. Translate the following content to Vietnamese while maintaining its original meaning, style, and tone:

${content}

Translation:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedContent = response.text();

    // Return success response
    const responseData = {
      jsonrpc: '2.0',
      result: {
        id: params.id,
        sessionId: params.sessionId,
        status: {
          state: 'completed',
          message: {
            role: 'agent',
            parts: [
              {
                type: 'text',
                text: translatedContent,
              },
            ],
          },
        },
        artifacts: [
          {
            name: 'Translation',
            index: 0,
            parts: [
              {
                type: 'text',
                text: translatedContent,
              },
            ],
          },
        ],
      },
      id,
    };
    console.log('Sending response:', JSON.stringify(responseData, null, 2));
    res.json(responseData);
  } catch (error) {
    console.error('Translation error:', error);
    const errorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error during translation',
      },
      id: req.body.id,
    };
    console.log(
      'Sending error response:',
      JSON.stringify(errorResponse, null, 2)
    );
    res.status(500).json(errorResponse);
  }
});

// Start server
const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Translator agent running at http://localhost:${PORT}`);
});
