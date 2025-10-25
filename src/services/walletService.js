import { createCdpClient } from "./mockCdpClient.js";

class WalletService {
  constructor() {
    this.cdp = null;
    this.walletSecret = null;
    this.accounts = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize the CDP SDK with wallet secret
   * @param {string} walletSecret - The wallet secret for authentication
   */
  async initialize(walletSecret) {
    try {
      this.walletSecret = walletSecret;
      this.cdp = await createCdpClient({
        walletSecret: walletSecret,
        environment: "sandbox", // Change to 'production' for mainnet
      });

      this.isInitialized = true;
      console.log("CDP SDK initialized successfully");
      return { success: true, message: "Wallet service initialized" };
    } catch (error) {
      console.error("Failed to initialize wallet service:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a new EVM account
   * @param {string} accountName - Name for the account
   * @param {string} network - Network to create account on (e.g., 'ethereum', 'base', 'polygon')
   */
  async createEVMAccount(accountName, network = "ethereum") {
    try {
      if (!this.isInitialized) {
        throw new Error("Wallet service not initialized");
      }

      const accounts = await this.cdp.accounts();
      const account = await accounts.create({
        name: accountName,
        type: "evm",
        network: network,
      });

      this.accounts.set(account.id, account);
      return {
        success: true,
        account: {
          id: account.id,
          name: account.name,
          address: account.address,
          network: network,
          type: "evm",
        },
      };
    } catch (error) {
      console.error("Failed to create EVM account:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a new Smart Account (EIP-4337)
   * @param {string} accountName - Name for the account
   * @param {string} network - Network to create account on
   */
  async createSmartAccount(accountName, network = "ethereum") {
    try {
      if (!this.isInitialized) {
        throw new Error("Wallet service not initialized");
      }

      const accounts = await this.cdp.accounts();
      const account = await accounts.create({
        name: accountName,
        type: "smart_account",
        network: network,
      });

      this.accounts.set(account.id, account);
      return {
        success: true,
        account: {
          id: account.id,
          name: account.name,
          address: account.address,
          network: network,
          type: "smart_account",
        },
      };
    } catch (error) {
      console.error("Failed to create Smart Account:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get wallet address for a specific account
   * @param {string} accountId - Account ID
   */
  async getWalletAddress(accountId) {
    try {
      if (!this.isInitialized) {
        throw new Error("Wallet service not initialized");
      }

      const account = this.accounts.get(accountId);
      if (!account) {
        // Try to fetch from CDP if not in local cache
        const accounts = await this.cdp.accounts();
        const fetchedAccount = await accounts.get(accountId);
        this.accounts.set(accountId, fetchedAccount);
        return {
          success: true,
          address: fetchedAccount.address,
          accountName: fetchedAccount.name,
        };
      }

      return {
        success: true,
        address: account.address,
        accountName: account.name,
      };
    } catch (error) {
      console.error("Failed to get wallet address:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get wallet balance for a specific account
   * @param {string} accountId - Account ID
   * @param {string} tokenAddress - Token address (optional, defaults to native token)
   */
  async getWalletBalance(accountId, tokenAddress = null) {
    try {
      if (!this.isInitialized) {
        throw new Error("Wallet service not initialized");
      }

      const accounts = await this.cdp.accounts();
      const balance = await accounts.getBalance({
        accountId: accountId,
        tokenAddress: tokenAddress,
      });

      return {
        success: true,
        balance: balance,
        tokenAddress: tokenAddress || "native",
      };
    } catch (error) {
      console.error("Failed to get wallet balance:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send tokens from one account to another
   * @param {string} fromAccountId - Source account ID
   * @param {string} toAddress - Destination address
   * @param {string} amount - Amount to send
   * @param {string} tokenAddress - Token address (optional, defaults to native token)
   * @param {string} network - Network to send on
   */
  async sendTokens(
    fromAccountId,
    toAddress,
    amount,
    tokenAddress = null,
    network = "ethereum"
  ) {
    try {
      if (!this.isInitialized) {
        throw new Error("Wallet service not initialized");
      }

      const accounts = await this.cdp.accounts();
      const transaction = await accounts.sendTransaction({
        accountId: fromAccountId,
        to: toAddress,
        value: amount,
        tokenAddress: tokenAddress,
        network: network,
      });

      return {
        success: true,
        transactionHash: transaction.hash,
        message: `Successfully sent ${amount} ${
          tokenAddress ? "tokens" : "ETH"
        } to ${toAddress}`,
      };
    } catch (error) {
      console.error("Failed to send tokens:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Grant spend permissions to another account
   * @param {string} accountId - Account to grant permissions from
   * @param {string} spenderAddress - Address to grant permissions to
   * @param {string} amount - Amount to allow spending
   * @param {string} tokenAddress - Token address (optional, defaults to native token)
   */
  async grantSpendPermission(
    accountId,
    spenderAddress,
    amount,
    tokenAddress = null
  ) {
    try {
      if (!this.isInitialized) {
        throw new Error("Wallet service not initialized");
      }

      const accounts = await this.cdp.accounts();
      const permission = await accounts.grantSpendPermission({
        accountId: accountId,
        spender: spenderAddress,
        amount: amount,
        tokenAddress: tokenAddress,
      });

      return {
        success: true,
        permissionId: permission.id,
        message: `Granted spend permission to ${spenderAddress} for ${amount} ${
          tokenAddress ? "tokens" : "ETH"
        }`,
      };
    } catch (error) {
      console.error("Failed to grant spend permission:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Revoke spend permissions
   * @param {string} accountId - Account to revoke permissions from
   * @param {string} spenderAddress - Address to revoke permissions from
   * @param {string} tokenAddress - Token address (optional, defaults to native token)
   */
  async revokeSpendPermission(accountId, spenderAddress, tokenAddress = null) {
    try {
      if (!this.isInitialized) {
        throw new Error("Wallet service not initialized");
      }

      const accounts = await this.cdp.accounts();
      await accounts.revokeSpendPermission({
        accountId: accountId,
        spender: spenderAddress,
        tokenAddress: tokenAddress,
      });

      return {
        success: true,
        message: `Revoked spend permission from ${spenderAddress}`,
      };
    } catch (error) {
      console.error("Failed to revoke spend permission:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * List all accounts
   */
  async listAccounts() {
    try {
      if (!this.isInitialized) {
        throw new Error("Wallet service not initialized");
      }

      const accountsApi = await this.cdp.accounts();
      const accounts = await accountsApi.list();

      // Update local cache
      accounts.forEach((account) => {
        this.accounts.set(account.id, account);
      });

      return {
        success: true,
        accounts: accounts.map((account) => ({
          id: account.id,
          name: account.name,
          address: account.address,
          type: account.type,
          network: account.network,
        })),
      };
    } catch (error) {
      console.error("Failed to list accounts:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get account by ID
   * @param {string} accountId - Account ID
   */
  async getAccount(accountId) {
    try {
      if (!this.isInitialized) {
        throw new Error("Wallet service not initialized");
      }

      const accounts = await this.cdp.accounts();
      const account = await accounts.get(accountId);
      this.accounts.set(accountId, account);

      return {
        success: true,
        account: {
          id: account.id,
          name: account.name,
          address: account.address,
          type: account.type,
          network: account.network,
        },
      };
    } catch (error) {
      console.error("Failed to get account:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if wallet service is initialized
   */
  isReady() {
    return this.isInitialized && this.cdp !== null;
  }

  /**
   * Get all cached accounts
   */
  getCachedAccounts() {
    return Array.from(this.accounts.values()).map((account) => ({
      id: account.id,
      name: account.name,
      address: account.address,
      type: account.type,
      network: account.network,
    }));
  }
}

// Export singleton instance
export const walletService = new WalletService();
export default walletService;
