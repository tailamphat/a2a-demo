import { useState } from 'react';
import axios from 'axios';
import { A2ARequest, A2AResponse } from './types/a2a';

const WRITER_AGENT_URL = 'http://localhost:8000';
const TRANSLATOR_AGENT_URL = 'http://localhost:8001';

function App() {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRequest = (topic: string): A2ARequest => ({
    jsonrpc: '2.0',
    method: 'tasks/send',
    params: { topic },
    id: Math.random().toString(36).substring(7),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      // Step 1: Call the writer agent
      const writerRequest = generateRequest(topic);
      const writerResponse = await axios.post<A2AResponse>(
        WRITER_AGENT_URL,
        writerRequest
      );
      console.error('Writer response:', writerResponse.data);
      const englishContent =
        writerResponse.data.result.artifacts[0].parts[0].text;

      // Step 2: Call the translator agent
      const translatorRequest = generateRequest(englishContent);
      const translatorResponse = await axios.post<A2AResponse>(
        TRANSLATOR_AGENT_URL,
        translatorRequest
      );
      const translatedContent =
        translatorResponse.data.result.artifacts[0].parts[0].text;

      setResult(translatedContent);
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>A2A Blog Generator</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="topic"
            style={{ display: 'block', marginBottom: '10px' }}
          >
            Enter Blog Topic:
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Processing...' : 'Generate Blog'}
        </button>
      </form>
      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <h2>Generated Content:</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
