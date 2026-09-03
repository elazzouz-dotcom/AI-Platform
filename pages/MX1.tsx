import React, { useState, useEffect } from 'react';
import { azzouz } from '../workers/azzouz';

interface AIResponse {
  status: 'loading' | 'success' | 'error';
  data?: any;
  error?: string;
}

const MX1: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<AIResponse>({ status: 'loading' });
  const [history, setHistory] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setResponse({ status: 'loading' });
    setHistory([...history, input]);

    try {
      const result = await azzouz.process(input);
      setResponse({
        status: 'success',
        data: result
      });
    } catch (err) {
      setResponse({
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
    setInput('');
  };

  return (
    <div className="mx1-container">
      <div className="mx1-header">
        <h1>🤖 MX1 - AI Platform</h1>
        <p>Powered by: <strong>azzouz</strong> AI Worker</p>
      </div>

      <div className="mx1-content">
        <form onSubmit={handleSubmit} className="mx1-form">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your query..."
            className="mx1-input"
          />
          <button type="submit" className="mx1-submit">
            Send to azzouz
          </button>
        </form>

        <div className="mx1-response">
          {response.status === 'loading' && <p>Processing...</p>}
          {response.status === 'success' && (
            <div className="response-data">
              <h3>Response:</h3>
              <pre>{JSON.stringify(response.data, null, 2)}</pre>
            </div>
          )}
          {response.status === 'error' && (
            <div className="error-message">
              <h3>Error:</h3>
              <p>{response.error}</p>
            </div>
          )}
        </div>

        <div className="mx1-history">
          <h3>History</h3>
          <ul>
            {history.map((item, idx) => (
              <li key={idx}>{item.substring(0, 50)}...</li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .mx1-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .mx1-header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #007bff;
          padding-bottom: 20px;
        }
        .mx1-header h1 {
          margin: 0;
          font-size: 2.5em;
          color: #333;
        }
        .mx1-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 30px;
        }
        .mx1-input {
          width: 100%;
          min-height: 120px;
          padding: 15px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-family: monospace;
          font-size: 14px;
          resize: vertical;
        }
        .mx1-submit {
          padding: 12px 30px;
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }
        .mx1-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
        }
        .mx1-response {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #28a745;
        }
        .error-message {
          color: #721c24;
          background: #f8d7da;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #dc3545;
        }
        .mx1-history {
          background: #fff;
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 8px;
        }
        .mx1-history h3 {
          margin-top: 0;
        }
        .mx1-history ul {
          list-style: none;
          padding: 0;
        }
        .mx1-history li {
          padding: 8px 0;
          border-bottom: 1px solid #eee;
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default MX1;