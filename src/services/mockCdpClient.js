// Mock CDP Client for development and testing
// This provides a fallback when the real CDP SDK has issues

export class MockCdpClient {
  constructor(config) {
    this.config = config;
    this.accounts = new Map();
    this.accountCounter = 0;
    console.log("Using Mock CDP Client for development");
  }

  async accounts() {
    return {
      create: async (params) => {
        const accountId = `mock-account-${++this.accountCounter}`;
        const mockAccount = {
          id: accountId,
          name: params.name || `Mock Account ${this.accountCounter}`,
          address: `0x${Math.random().toString(16).substr(2, 40)}`,
          type: params.type || "evm",
          network: params.network || "ethereum",
        };

        this.accounts.set(accountId, mockAccount);
        return mockAccount;
      },

      get: async (accountId) => {
        return (
          this.accounts.get(accountId) || {
            id: accountId,
            name: "Mock Account",
            address: `0x${Math.random().toString(16).substr(2, 40)}`,
            type: "evm",
            network: "ethereum",
          }
        );
      },

      list: async () => {
        return Array.from(this.accounts.values());
      },

      getBalance: async (params) => {
        // Return a mock balance
        return {
          balance: "1.5",
          tokenAddress: params.tokenAddress || "native",
        };
      },

      sendTransaction: async (params) => {
        // Return a mock transaction hash
        return {
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        };
      },

      grantSpendPermission: async (params) => {
        // Return a mock permission ID
        return {
          id: `permission-${Math.random().toString(16).substr(2, 8)}`,
        };
      },

      revokeSpendPermission: async (params) => {
        // Mock successful revocation
        return { success: true };
      },
    };
  }
}

// Export a function to create the appropriate client
export const createCdpClient = async (config) => {
  // Check if we're in a browser environment and if polyfills are working
  if (
    typeof window !== "undefined" &&
    typeof globalThis.Buffer === "undefined"
  ) {
    console.warn("Buffer polyfill not available, using Mock CDP Client");
    return new MockCdpClient(config);
  }

  try {
    // Try to use the real CDP client
    // Note: In browser environment, this will likely fail and fall back to mock
    const { CdpClient } = await import("@coinbase/cdp-sdk");
    return new CdpClient(config);
  } catch (error) {
    console.warn(
      "Failed to load real CDP client, using Mock CDP Client:",
      error.message
    );
    return new MockCdpClient(config);
  }
};
