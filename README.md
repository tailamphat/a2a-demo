# A2A Blog Generator

This is a TypeScript implementation of an A2A (Agent-to-Agent) blog generation system. The system consists of three components:

1. Frontend (React + TypeScript)
2. Writer Agent (Express + LangChain)
3. Translator Agent (Express + LangChain)

## Prerequisites

- Node.js (v18 or higher)
- npm
- OpenAI API key

## Setup

1. Clone the repository
2. Set up the environment variables:

   ```bash
   # Create .env files in writer-agent and translator-agent directories
   echo "OPENAI_API_KEY=your_api_key_here" > writer-agent/.env
   echo "OPENAI_API_KEY=your_api_key_here" > translator-agent/.env
   ```

3. Install dependencies for each component:

   ```bash
   # Frontend
   cd frontend
   npm install

   # Writer Agent
   cd ../writer-agent
   npm install

   # Translator Agent
   cd ../translator-agent
   npm install
   ```

## Running the Application

1. Start the Writer Agent:

   ```bash
   cd writer-agent
   npm run dev
   ```

2. Start the Translator Agent:

   ```bash
   cd translator-agent
   npm run dev
   ```

3. Start the Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Writer Agent: http://localhost:8000
- Translator Agent: http://localhost:8001

## Usage

1. Open http://localhost:3000 in your browser
2. Enter a blog topic in the input field
3. Click "Generate Blog"
4. The system will:
   - Send the topic to the Writer Agent to generate content
   - Pass the generated content to the Translator Agent
   - Display the translated content in the UI

## Architecture

The system follows the A2A protocol for communication between agents:

1. Frontend acts as the orchestrator, making sequential calls to the agents
2. Writer Agent uses LangChain to generate blog content
3. Translator Agent uses LangChain to translate the content
4. All communication follows the JSON-RPC format with the `tasks/send` method

## Technical Details

### Frontend

- Built with React and TypeScript
- Uses Vite for development and building
- Implements a simple UI for topic input and result display
- Makes HTTP requests to both agents using axios

### Writer Agent

- Built with Express and TypeScript
- Uses LangChain with OpenAI's GPT-3.5-turbo model
- Implements a prompt template for blog generation
- Runs on port 8000

### Translator Agent

- Built with Express and TypeScript
- Uses LangChain with OpenAI's GPT-3.5-turbo model
- Implements a prompt template for translation
- Runs on port 8001

## Environment Variables

Both agents require an OpenAI API key to be set in their respective `.env` files:

```
OPENAI_API_KEY=your_api_key_here
```

## Error Handling

The system includes error handling for:

- Invalid API requests
- Missing or invalid environment variables
- OpenAI API errors
- Network communication issues

Each component logs errors appropriately and returns meaningful error messages to the client.
