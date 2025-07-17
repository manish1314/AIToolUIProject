import React, { useState } from 'react';
import SwaggerTestGenerator from './SwaggerTestGenerator';
import SeleniumToPlaywrite from './seleniumtoplaywrite';
import GenerateManualTests from './GenerateManualTests'

function TestToolSelector() {
  const [selectedTool, setSelectedTool] = useState(null);

  const renderToolForm = () => {
    switch (selectedTool) {
      case 'selenium':
        return <SeleniumToPlaywrite />;
      case 'swagger':
        return <SwaggerTestGenerator />;
      case 'jira':
        return <GenerateManualTests />;
      default:
        return (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold">Please select a tool from above</h2>
          </div>
        );
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">QA Automation Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <ToolCard 
          title="Selenium to Playwright"
          description="Convert Selenium Java code to Playwright"
          icon="💻"
          onClick={() => setSelectedTool('selenium')}
          active={selectedTool === 'selenium'}
        />
        <ToolCard 
          title="Swagger Test Generator"
          description="Generate tests from Swagger/OpenAPI spec"
          icon="📄"
          onClick={() => setSelectedTool('swagger')}
          active={selectedTool === 'swagger'}
        />
        <ToolCard 
          title="Jira Test Generator"
          description="Generate manual tests from Jira stories"
          icon="📝"
          onClick={() => setSelectedTool('jira')}
          active={selectedTool === 'jira'}
        />
      </div>

      {renderToolForm()}
    </div>
  );
}

function ToolCard({ title, description, icon, onClick, active }) {
  return (
    <div 
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${active ? 
        'border-blue-500 bg-blue-50 shadow-lg' : 
        'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
      onClick={onClick}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default TestToolSelector;