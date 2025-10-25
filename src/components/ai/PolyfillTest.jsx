import React, { useState, useEffect } from "react";

const PolyfillTest = () => {
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    const runTests = async () => {
      const results = {};

      // Test Buffer
      try {
        if (typeof globalThis.Buffer !== "undefined") {
          const buf = Buffer.from("test");
          results.buffer = {
            status: "✅ Working",
            value: buf.toString(),
          };
        } else {
          results.buffer = {
            status: "❌ Not Available",
            value: "Buffer is undefined",
          };
        }
      } catch (error) {
        results.buffer = {
          status: "❌ Error",
          value: error.message,
        };
      }

      // Test process
      try {
        if (typeof globalThis.process !== "undefined") {
          results.process = {
            status: "✅ Working",
            value: `Platform: ${globalThis.process.platform || "unknown"}`,
          };
        } else {
          results.process = {
            status: "❌ Not Available",
            value: "process is undefined",
          };
        }
      } catch (error) {
        results.process = {
          status: "❌ Error",
          value: error.message,
        };
      }

        // Test CDP SDK import
        try {
          const { createCdpClient } = await import("../../services/mockCdpClient.js");
          const client = await createCdpClient({ walletSecret: "test" });
          results.cdpImport = {
            status: "✅ Working",
            value: "CDP Client created successfully",
          };
        } catch (error) {
          results.cdpImport = {
            status: "❌ Error",
            value: error.message,
          };
        }

      setTestResults(results);
    };

    runTests();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Polyfill Test Results</h3>
      <div className="space-y-2">
        {Object.entries(testResults).map(([key, result]) => (
          <div
            key={key}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span className="font-medium capitalize">{key}:</span>
            <div className="text-right">
              <div className="font-semibold">{result.status}</div>
              <div className="text-sm text-gray-600">{result.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolyfillTest;
