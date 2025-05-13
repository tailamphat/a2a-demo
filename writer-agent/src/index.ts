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
    name: 'Blog Writer Agent',
    description:
      "An AI agent that generates well-structured, informative, and engaging blog posts based on given topics using Google's Gemini model. The agent can create content with proper introductions, main points, and conclusions.",
    url: 'http://localhost:8000',
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
        id: 'blog_writing',
        name: 'blog-writing',
        description: 'Generates blog posts based on given topics',
      },
    ],
  });
});

// Helper function for blog generation
async function generateBlogContent(topic: string) {
  const prompt = `Write a blog post about ${topic}. The blog post should be well-structured, informative, and engaging. Include an introduction, main points, and a conclusion.`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// A2A Protocol handler for root endpoint
app.post('/', async (req, res) => {
  try {
    console.log('Received request at /:', JSON.stringify(req.body, null, 2));
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

    // Extract topic from params
    let { topic } = params;
    topic = topic ?? params.message?.parts?.[0]?.text;

    console.log('Request params:', JSON.stringify(params, null, 2));
    console.log('Extracted topic:', topic);

    if (!topic) {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32602,
          message: 'Missing required parameter: topic',
        },
        id,
      });
    }

    // Generate blog content
    const content = await generateBlogContent(topic);

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
                text: content,
              },
            ],
          },
        },
        artifacts: [
          {
            name: 'Answer',
            index: 0,
            parts: [
              {
                type: 'text',
                text: content,
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
    console.error('Generation error:', error);
    const errorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error during content generation',
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
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Writer agent running at http://localhost:${PORT}`);
});
