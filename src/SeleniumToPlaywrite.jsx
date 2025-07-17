// SeleniumToPlaywrite.jsx
import { useState } from 'react';
import axios from 'axios';
import './App.css';


function SeleniumToPlaywrite() {
  const [seleniumCode, setSeleniumCode] = useState(
    'WebDriver driver = new ChromeDriver();\ndriver.get("https://mettl.com");'
  );
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Read API base URL from Vite env variable
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleConvert = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiBaseUrl}/convert/seleniumToPlaywright`, {
        seleniumCode,
        llmApiKey: import.meta.env.VITE_OPENAI_API_KEY,

        llmApiUrl: 'https://api.openai.com/v1/chat/completions',
        llmModel: 'gpt-4o-mini'
      });
      setResponse(res.data);
    } catch (error) {
      setResponse(error.response?.data || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>Selenium to Playwright Converter</h1>
      <textarea
        rows="10"
        cols="80"
        value={seleniumCode}
        onChange={(e) => setSeleniumCode(e.target.value)}
        placeholder="Enter Selenium Java code here"
      />
      <br />
      <button onClick={handleConvert} disabled={loading}>
        {loading ? 'Converting...' : 'Convert to Playwright'}
      </button>
      <div className="output">
        <h2>Response:</h2>
        <pre>{typeof response === 'string' ? response : JSON.stringify(response, null, 2)}</pre>
      </div>
    </div>
  );
}

export default SeleniumToPlaywrite;
