import { useState } from 'react';
import axios from 'axios';
import './App.css'; // Optional: style as needed

function ParseSwagger() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Load base URL from environment
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a Swagger JSON/YAML file first.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${apiBaseUrl}/parseSwagger`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(res.data);
    } catch (error) {
      setResponse(error.response?.data || 'Error while uploading file.');
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>Parse Swagger File</h1>
      <input type="file" accept=".json,.yaml,.yml" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Parsing...' : 'Upload & Parse'}
      </button>
      <div className="output">
        <h2>Response:</h2>
        <pre>{typeof response === 'string' ? response : JSON.stringify(response, null, 2)}</pre>
      </div>
    </div>
  );
}

export default ParseSwagger;
