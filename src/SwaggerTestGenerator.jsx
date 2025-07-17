import { useState } from 'react';
import axios from 'axios';

function SwaggerTestGenerator() {
  const [file, setFile] = useState(null);
  const [apiDetails, setApiDetails] = useState('');
  const [testTypes, setTestTypes] = useState([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Load base URL from Vite environment
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTestTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTestTypes([...testTypes, value]);
    } else {
      setTestTypes(testTypes.filter((type) => type !== value));
    }
  };

  const parseSwagger = async () => {
    if (!file) return alert('Please upload a Swagger file.');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${apiBaseUrl}/parseSwagger`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setApiDetails(res.data);
      setResponse('');
    } catch (error) {
      setApiDetails('');
      setResponse(error.response?.data || 'Failed to parse Swagger.');
    }
    setLoading(false);
  };

  const generateTests = async () => {
    if (!apiDetails || testTypes.length === 0) {
      return alert('Parsed API details and at least one test type are required.');
    }

    setLoading(true);
    try {
      const res = await axios.post(`${apiBaseUrl}/generateTests`, {
        apiDetails,
        testTypes,
        llmApiKey: import.meta.env.VITE_OPENAI_API_KEY,
        llmApiUrl: 'https://api.openai.com/v1/chat/completions',
        llmModel: 'gpt-4o-mini'
      });
      setResponse(res.data);
    } catch (error) {
      setResponse(error.response?.data || 'Failed to generate tests.');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">Swagger File to Test Case Generator</h1>

      <input type="file" accept=".json,.yaml,.yml" onChange={handleFileChange} />
      <br />
      <button onClick={parseSwagger} disabled={loading}>
        {loading ? 'Parsing Swagger...' : 'Parse Swagger'}
      </button>

      {apiDetails && (
        <>
          <div>
            <h3>Parsed API Details:</h3>
            <pre>{apiDetails}</pre>
          </div>

          <div>
            <h4>Select Test Types:</h4>
            <label><input type="checkbox" value="Positive" onChange={handleTestTypeChange} /> Positive</label><br />
            <label><input type="checkbox" value="Negative" onChange={handleTestTypeChange} /> Negative</label><br />
            <label><input type="checkbox" value="Edge" onChange={handleTestTypeChange} /> Edge</label>
          </div>

          <button onClick={generateTests} disabled={loading}>
            {loading ? 'Generating Tests...' : 'Generate Test Cases'}
          </button>
        </>
      )}

      {response && (
        <div className="output">
          <h3>Generated Test Cases:</h3>
          <pre>{typeof response === 'string' ? response : JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default SwaggerTestGenerator;
