import React, { useState } from 'react';
import SwaggerTestGenerator from './SwaggerTestGenerator';
import GenerateManualTests from './GenerateManualTests';
import SeleniumToPlaywrite from './seleniumtoplaywrite';

function ToolSelector() {
  const [selectedTool, setSelectedTool] = useState('');

  const renderSelectedTool = () => {
    switch (selectedTool) {
      case 'swagger':
        return <SwaggerTestGenerator />;
      case 'manual':
        return <GenerateManualTests />;
      case 'selenium':
        return <SeleniumToPlaywrite />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">AI Test Tool Suite</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setSelectedTool('manual')}
          className={`px-4 py-2 rounded ${selectedTool === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Manual (Jira → Test Case)
        </button>
        <button
          onClick={() => setSelectedTool('swagger')}
          className={`px-4 py-2 rounded ${selectedTool === 'swagger' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Swagger → API Test
        </button>
        <button
          onClick={() => setSelectedTool('selenium')}
          className={`px-4 py-2 rounded ${selectedTool === 'selenium' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Selenium → Playwright
        </button>
      </div>

      <div className="mt-4">
        {renderSelectedTool()}
      </div>
    </div>
  );
}

export default ToolSelector;
