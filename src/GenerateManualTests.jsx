import React, { useState } from 'react';
import axios from 'axios';

const GenerateTestCasesForm = () => {
  const [formData, setFormData] = useState({
    userStoryDescription: '',
    applicationUrl: '',
    acceptanceCriteria: '',
    epicDescription: '',
    additionalInstructions: '',
    testType: {
      positive: false,
      negative: false,
      edge: false,
    },
  });

  const [contextFile, setContextFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCheckboxChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      testType: { ...prev.testType, [type]: !prev.testType[type] },
    }));
  };

  const handleContextFileChange = (e) => {
    setContextFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(''); // Clear previous response

    try {
      const submissionData = { ...formData }; // ✅ send testType as object

      const payload = new FormData();
      const jsonBlob = new Blob([JSON.stringify(submissionData)], {
        type: 'application/json',
      });

      payload.append('request', jsonBlob);
      if (contextFile) payload.append('contextFile', contextFile);

      const res = await axios.post(`${apiBaseUrl}/generateTestCases`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResponse(res.data);
    } catch (error) {
      setResponse(error.response?.data || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white p-10 rounded-2xl shadow-lg border">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
          Generate Manual Test Cases
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8"> {/* Increased gap for more space */}
          {/* User Story Description */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              User Story Description
            </label>
            <textarea
              className="w-full h-40 p-4 border border-gray-300 rounded-lg text-base resize-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the user story in detail..."
              value={formData.userStoryDescription}
              onChange={handleInputChange('userStoryDescription')}
            />
          </div>

          {/* Application URL */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Application URL
            </label>
            <input
              type="url"
              className="w-full h-12 p-4 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
              value={formData.applicationUrl}
              onChange={handleInputChange('applicationUrl')}
            />
          </div>

          {/* Epic Description */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Epic Description (optional)
            </label>
            <textarea
              className="w-full h-24 p-4 border border-gray-300 rounded-lg text-base resize-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief context about the epic"
              value={formData.epicDescription}
              onChange={handleInputChange('epicDescription')}
            />
          </div>

          {/* Additional Instructions */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Additional Instructions (optional)
            </label>
            <textarea
              className="w-full h-24 p-4 border border-gray-300 rounded-lg text-base resize-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any extra guidance or notes for test generation"
              value={formData.additionalInstructions}
              onChange={handleInputChange('additionalInstructions')}
            />
          </div>

          {/* Upload Context File */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Upload Context From Old Test Cases (Excel)
            </label>
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleContextFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Acceptance Criteria */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Acceptance Criteria
            </label>
            <textarea
              className="w-full h-28 p-4 border border-gray-300 rounded-lg text-base resize-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="List the acceptance criteria clearly..."
              value={formData.acceptanceCriteria}
              onChange={handleInputChange('acceptanceCriteria')}
            />
          </div>

          {/* Test Types */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">
              Select Test Types
            </label>
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-md text-gray-700"> {/* Added gap-y for vertical spacing between checkboxes */}
              {['positive', 'negative', 'edge'].map((type) => (
                <label key={type} className="flex items-center gap-2 capitalize">
                  <input
                    type="checkbox"
                    checked={formData.testType[type]}
                    onChange={() => handleCheckboxChange(type)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded" // Tailwind form-checkbox for better styling
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg py-3 rounded-lg shadow transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500" // Made text bolder
            >
              {loading ? 'Generating Test Cases...' : 'Generate Test Cases'}
            </button>
          </div>

          {/* Response */}
          {response && (
            <div className="mt-8"> {/* Added margin-top for spacing */}
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">Response</h2>
              <pre className="bg-gray-100 p-6 rounded-lg text-sm whitespace-pre-wrap border max-h-[600px] overflow-auto text-gray-900 leading-relaxed"> {/* Improved readability */}
                {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default GenerateTestCasesForm;