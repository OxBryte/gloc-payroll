// CDP SDK wrapper to handle browser compatibility
import { CdpClient } from "@coinbase/cdp-sdk";

// Ensure Buffer is available globally for the CDP SDK
if (typeof globalThis.Buffer === "undefined") {
  // This should be handled by the Vite polyfills, but adding as fallback
  console.warn(
    "Buffer is not available. Make sure Node.js polyfills are configured."
  );
}

// Ensure process is available
if (typeof globalThis.process === "undefined") {
  globalThis.process = {
    env: {},
    version: "v18.0.0",
    versions: {},
    platform: "browser",
    nextTick: (fn) => setTimeout(fn, 0),
    cwd: () => "/",
    chdir: () => {},
    umask: () => 0,
    hrtime: () => [0, 0],
    uptime: () => 0,
    memoryUsage: () => ({}),
    exit: () => {},
    kill: () => {},
    abort: () => {},
    on: () => {},
    off: () => {},
    emit: () => {},
    addListener: () => {},
    removeListener: () => {},
    removeAllListeners: () => {},
    setMaxListeners: () => {},
    getMaxListeners: () => 10,
    listeners: () => [],
    rawListeners: () => [],
    listenerCount: () => 0,
    eventNames: () => [],
    prependListener: () => {},
    prependOnceListener: () => {},
    once: () => {},
  };
}

// Export the CDP client with proper error handling
export const createCdpClient = (config) => {
  try {
    // Add additional browser compatibility checks
    if (!globalThis.Buffer) {
      throw new Error(
        "Buffer polyfill is required for CDP SDK in browser environment"
      );
    }

    return new CdpClient(config);
  } catch (error) {
    console.error("Failed to create CDP client:", error);
    throw new Error(`CDP SDK initialization failed: ${error.message}`);
  }
};

// Export the CDP class for direct use
export { CdpClient };
