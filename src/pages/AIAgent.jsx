import React, { useState } from "react";
import AIAgent from "../components/ai/agent.jsx";
import AIAgentDemo from "../components/ai/AIAgentDemo.jsx";
import PolyfillTest from "../components/ai/PolyfillTest.jsx";

const AIAgentPage = () => {
  const [showDemo, setShowDemo] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setShowDemo(true)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                showDemo
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Features & Demo
            </button>
            <button
              onClick={() => setShowDemo(false)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                !showDemo
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              AI Agent Chat
            </button>
          </div>

          {/* Temporary polyfill test */}
          <div className="mb-6">
            <PolyfillTest />
          </div>
        </div>

        {showDemo ? <AIAgentDemo /> : <AIAgent />}
      </div>
    </div>
  );
};

export default AIAgentPage;
