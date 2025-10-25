import walletService from "./walletService.js";

class PromptHandler {
  constructor() {
    this.commands = {
      // Wallet creation commands
      "create wallet": this.handleCreateWallet,
      "create account": this.handleCreateWallet,
      "new wallet": this.handleCreateWallet,
      "create evm wallet": this.handleCreateEVMWallet,
      "create smart wallet": this.handleCreateSmartWallet,
      "create smart account": this.handleCreateSmartWallet,

      // Wallet information commands
      "wallet address": this.handleGetWalletAddress,
      "get address": this.handleGetWalletAddress,
      "show address": this.handleGetWalletAddress,
      "what is my address": this.handleGetWalletAddress,
      "my wallet address": this.handleGetWalletAddress,

      // Balance commands
      "wallet balance": this.handleGetBalance,
      "check balance": this.handleGetBalance,
      "show balance": this.handleGetBalance,
      "how much do i have": this.handleGetBalance,
      "my balance": this.handleGetBalance,
      balance: this.handleGetBalance,

      // Send commands
      send: this.handleSendTokens,
      "send tokens": this.handleSendTokens,
      transfer: this.handleSendTokens,
      "send money": this.handleSendTokens,
      "send eth": this.handleSendTokens,

      // Account management
      "list accounts": this.handleListAccounts,
      "show accounts": this.handleListAccounts,
      "my accounts": this.handleListAccounts,
      accounts: this.handleListAccounts,

      // Spend permissions
      "grant permission": this.handleGrantPermission,
      "allow spending": this.handleGrantPermission,
      "grant spend": this.handleGrantPermission,
      "revoke permission": this.handleRevokePermission,
      "remove permission": this.handleRevokePermission,
      "revoke spend": this.handleRevokePermission,

      // Help
      help: this.handleHelp,
      commands: this.handleHelp,
      "what can you do": this.handleHelp,
    };
  }

  /**
   * Process a natural language prompt and execute the appropriate command
   * @param {string} prompt - User's natural language input
   * @param {Object} context - Additional context (accountId, etc.)
   */
  async processPrompt(prompt, context = {}) {
    try {
      const normalizedPrompt = prompt.toLowerCase().trim();

      // Find matching command
      const command = this.findMatchingCommand(normalizedPrompt);

      if (!command) {
        return {
          success: false,
          message:
            "I didn't understand that command. Type 'help' to see available commands.",
          suggestions: this.getSuggestions(normalizedPrompt),
        };
      }

      // Execute the command
      const result = await command.handler(normalizedPrompt, context);
      return result;
    } catch (error) {
      console.error("Error processing prompt:", error);
      return {
        success: false,
        message: "An error occurred while processing your request.",
        error: error.message,
      };
    }
  }

  /**
   * Find the best matching command for the prompt
   * @param {string} prompt - Normalized prompt
   */
  findMatchingCommand(prompt) {
    // Direct command match
    for (const [command, handler] of Object.entries(this.commands)) {
      if (prompt.includes(command)) {
        return { command, handler };
      }
    }

    // Partial match for common patterns
    if (
      prompt.includes("create") &&
      (prompt.includes("wallet") || prompt.includes("account"))
    ) {
      return {
        command: "create wallet",
        handler: this.commands["create wallet"],
      };
    }

    if (prompt.includes("address") || prompt.includes("wallet address")) {
      return {
        command: "wallet address",
        handler: this.commands["wallet address"],
      };
    }

    if (
      prompt.includes("balance") ||
      prompt.includes("money") ||
      prompt.includes("amount")
    ) {
      return {
        command: "wallet balance",
        handler: this.commands["wallet balance"],
      };
    }

    if (prompt.includes("send") || prompt.includes("transfer")) {
      return { command: "send", handler: this.commands["send"] };
    }

    return null;
  }

  /**
   * Get command suggestions based on partial input
   * @param {string} prompt - Partial prompt
   */
  getSuggestions(prompt) {
    const suggestions = [];
    const commonCommands = [
      "create wallet",
      "wallet address",
      "check balance",
      "send tokens",
      "list accounts",
      "help",
    ];

    commonCommands.forEach((cmd) => {
      if (cmd.includes(prompt) || prompt.includes(cmd.split(" ")[0])) {
        suggestions.push(cmd);
      }
    });

    return suggestions.slice(0, 3);
  }

  // Command handlers
  async handleCreateWallet(prompt, _context) {
    const accountName =
      this.extractAccountName(prompt) || `Wallet-${Date.now()}`;
    const network = this.extractNetwork(prompt) || "ethereum";

    const result = await walletService.createEVMAccount(accountName, network);

    if (result.success) {
      return {
        success: true,
        message: `✅ Created new EVM wallet: ${result.account.name}`,
        data: {
          address: result.account.address,
          accountId: result.account.id,
          network: result.account.network,
        },
      };
    }

    return result;
  }

  async handleCreateEVMWallet(prompt, _context) {
    return this.handleCreateWallet(prompt, _context);
  }

  async handleCreateSmartWallet(prompt, _context) {
    const accountName =
      this.extractAccountName(prompt) || `SmartWallet-${Date.now()}`;
    const network = this.extractNetwork(prompt) || "ethereum";

    const result = await walletService.createSmartAccount(accountName, network);

    if (result.success) {
      return {
        success: true,
        message: `✅ Created new Smart Account: ${result.account.name}`,
        data: {
          address: result.account.address,
          accountId: result.account.id,
          network: result.account.network,
        },
      };
    }

    return result;
  }

  async handleGetWalletAddress(prompt, context) {
    let accountId = context.accountId || this.extractAccountId(prompt);

    if (!accountId) {
      // Get the first available account
      const accountsResult = await walletService.listAccounts();
      if (accountsResult.success && accountsResult.accounts.length > 0) {
        accountId = accountsResult.accounts[0].id;
      } else {
        return {
          success: false,
          message: "No accounts found. Please create a wallet first.",
        };
      }
    }

    const result = await walletService.getWalletAddress(accountId);

    if (result.success) {
      return {
        success: true,
        message: `📍 Wallet Address: ${result.address}`,
        data: {
          address: result.address,
          accountName: result.accountName,
        },
      };
    }

    return result;
  }

  async handleGetBalance(prompt, context) {
    let accountId = context.accountId || this.extractAccountId(prompt);
    const tokenAddress = this.extractTokenAddress(prompt);

    if (!accountId) {
      // Get the first available account
      const accountsResult = await walletService.listAccounts();
      if (accountsResult.success && accountsResult.accounts.length > 0) {
        accountId = accountsResult.accounts[0].id;
      } else {
        return {
          success: false,
          message: "No accounts found. Please create a wallet first.",
        };
      }
    }

    const result = await walletService.getWalletBalance(
      accountId,
      tokenAddress
    );

    if (result.success) {
      const tokenType = tokenAddress ? "tokens" : "ETH";
      return {
        success: true,
        message: `💰 Balance: ${result.balance} ${tokenType}`,
        data: {
          balance: result.balance,
          tokenAddress: result.tokenAddress,
        },
      };
    }

    return result;
  }

  async handleSendTokens(prompt, context) {
    const accountId = context.accountId || this.extractAccountId(prompt);
    const toAddress = this.extractAddress(prompt);
    const amount = this.extractAmount(prompt);
    const tokenAddress = this.extractTokenAddress(prompt);
    const network = this.extractNetwork(prompt) || "ethereum";

    if (!accountId || !toAddress || !amount) {
      return {
        success: false,
        message:
          'Please specify: account ID, recipient address, and amount. Example: "send 0.1 ETH to 0x123..."',
      };
    }

    const result = await walletService.sendTokens(
      accountId,
      toAddress,
      amount,
      tokenAddress,
      network
    );

    if (result.success) {
      return {
        success: true,
        message: `✅ ${result.message}`,
        data: {
          transactionHash: result.transactionHash,
        },
      };
    }

    return result;
  }

  async handleListAccounts(_prompt, _context) {
    const result = await walletService.listAccounts();

    if (result.success) {
      if (result.accounts.length === 0) {
        return {
          success: true,
          message: "No accounts found. Create a wallet first!",
        };
      }

      const accountList = result.accounts
        .map((acc) => `• ${acc.name} (${acc.type}): ${acc.address}`)
        .join("\n");

      return {
        success: true,
        message: `📋 Your Accounts:\n${accountList}`,
        data: {
          accounts: result.accounts,
        },
      };
    }

    return result;
  }

  async handleGrantPermission(prompt, context) {
    const accountId = context.accountId || this.extractAccountId(prompt);
    const spenderAddress = this.extractAddress(prompt);
    const amount = this.extractAmount(prompt);
    const tokenAddress = this.extractTokenAddress(prompt);

    if (!accountId || !spenderAddress || !amount) {
      return {
        success: false,
        message:
          'Please specify: account ID, spender address, and amount. Example: "grant 100 USDC spending to 0x123..."',
      };
    }

    const result = await walletService.grantSpendPermission(
      accountId,
      spenderAddress,
      amount,
      tokenAddress
    );

    if (result.success) {
      return {
        success: true,
        message: `✅ ${result.message}`,
        data: {
          permissionId: result.permissionId,
        },
      };
    }

    return result;
  }

  async handleRevokePermission(prompt, context) {
    const accountId = context.accountId || this.extractAccountId(prompt);
    const spenderAddress = this.extractAddress(prompt);
    const tokenAddress = this.extractTokenAddress(prompt);

    if (!accountId || !spenderAddress) {
      return {
        success: false,
        message:
          'Please specify: account ID and spender address. Example: "revoke spending from 0x123..."',
      };
    }

    const result = await walletService.revokeSpendPermission(
      accountId,
      spenderAddress,
      tokenAddress
    );

    if (result.success) {
      return {
        success: true,
        message: `✅ ${result.message}`,
      };
    }

    return result;
  }

  async handleHelp(_prompt, _context) {
    const helpText = `
🤖 **AI Wallet Agent Commands**

**Wallet Management:**
• "create wallet" - Create a new EVM wallet
• "create smart wallet" - Create a new Smart Account
• "wallet address" - Get wallet address
• "check balance" - Check wallet balance
• "list accounts" - Show all accounts

**Transactions:**
• "send 0.1 ETH to 0x123..." - Send tokens
• "send 100 USDC to 0x123..." - Send specific token

**Permissions:**
• "grant 100 USDC spending to 0x123..." - Grant spend permission
• "revoke spending from 0x123..." - Revoke spend permission

**General:**
• "help" - Show this help message

**Examples:**
• "Create a new wallet called MyWallet"
• "What's my wallet address?"
• "Check my ETH balance"
• "Send 0.5 ETH to 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
    `;

    return {
      success: true,
      message: helpText,
    };
  }

  // Helper methods for extracting information from prompts
  extractAccountName(prompt) {
    const match = prompt.match(/called\s+(\w+)|name\s+(\w+)|wallet\s+(\w+)/i);
    return match ? match[1] || match[2] || match[3] : null;
  }

  extractAccountId(prompt) {
    const match = prompt.match(/account\s+([a-f0-9-]+)/i);
    return match ? match[1] : null;
  }

  extractAddress(prompt) {
    const match = prompt.match(/0x[a-fA-F0-9]{40}/);
    return match ? match[0] : null;
  }

  extractAmount(prompt) {
    const match = prompt.match(/(\d+\.?\d*)\s*(ETH|USDC|USDT|tokens?)/i);
    return match ? match[1] : null;
  }

  extractTokenAddress(prompt) {
    const match = prompt.match(/0x[a-fA-F0-9]{40}/g);
    return match && match.length > 1 ? match[1] : null;
  }

  extractNetwork(prompt) {
    const networks = ["ethereum", "base", "polygon", "arbitrum", "optimism"];
    for (const network of networks) {
      if (prompt.includes(network)) {
        return network;
      }
    }
    return null;
  }
}

export const promptHandler = new PromptHandler();
export default promptHandler;
