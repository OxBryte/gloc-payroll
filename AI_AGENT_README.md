# AI Wallet Agent

An intelligent AI agent for blockchain transactions using Coinbase's Server Wallet v2. This agent allows users to interact with their blockchain wallets through natural language commands.

## Features

### 🤖 Natural Language Interface

- Chat-based interface for wallet operations
- Understands natural language commands
- Smart command suggestions and error handling

### 💼 Wallet Management

- **Create Wallets**: Create EVM wallets and Smart Accounts (EIP-4337)
- **Multi-Network Support**: Works across Ethereum, Base, Polygon, Arbitrum, and Optimism
- **Account Management**: List, view, and manage multiple accounts

### 💰 Transaction Operations

- **Check Balances**: Get wallet balances for native tokens and ERC-20 tokens
- **Send Tokens**: Send native tokens and ERC-20 tokens to any address
- **Transaction History**: View transaction details and hashes

### 🔐 Spend Permissions

- **Grant Permissions**: Allow other addresses to spend tokens on your behalf
- **Revoke Permissions**: Remove spending permissions from addresses
- **Permission Management**: Full control over who can spend your tokens

## Getting Started

### Prerequisites

1. **Coinbase CDP Account**: You need a Coinbase Developer Platform account
2. **Wallet Secret**: Obtain your Wallet Secret from the CDP Portal
3. **Node.js**: Version 16 or higher
4. **React**: Version 18 or higher

### Installation

The AI Agent is already integrated into your payroll project. The required dependencies are:

```json
{
  "@coinbase/cdp-sdk": "^latest"
}
```

### Setup

1. **Get Your Wallet Secret**:

   - Visit the [Coinbase CDP Portal](https://portal.cdp.coinbase.com)
   - Create a new project or use an existing one
   - Generate a Wallet Secret for Server Wallet v2

2. **Initialize the Agent**:
   - Navigate to `/ai-agent` in your application
   - Enter your Wallet Secret when prompted
   - The agent will initialize and be ready to use

## Usage

### Basic Commands

#### Wallet Creation

```
"create wallet"
"create a new EVM wallet"
"create smart wallet"
"create smart account"
```

#### Account Information

```
"wallet address"
"what's my address"
"show my wallet address"
"check balance"
"how much do I have"
"my balance"
```

#### Transactions

```
"send 0.1 ETH to 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
"send 100 USDC to 0x123..."
"transfer 0.5 ETH to 0x456..."
```

#### Account Management

```
"list accounts"
"show my accounts"
"my accounts"
```

#### Spend Permissions

```
"grant 100 USDC spending to 0x123..."
"allow 0x456... to spend 50 ETH"
"revoke spending from 0x789..."
"remove permission from 0xabc..."
```

### Advanced Features

#### Smart Accounts (EIP-4337)

Smart accounts provide advanced features:

- **Gas Sponsorship**: Pay gas fees for users
- **Transaction Batching**: Combine multiple operations
- **Custom Access Policies**: Set spending limits and time-based rules

#### Multi-Network Support

The agent supports multiple EVM networks:

- Ethereum Mainnet
- Base
- Polygon
- Arbitrum
- Optimism

#### Token Support

- Native tokens (ETH, MATIC, etc.)
- ERC-20 tokens (USDC, USDT, etc.)
- Custom token contracts

## Architecture

### Components

1. **AIAgent Component** (`src/components/ai/agent.jsx`)

   - Main chat interface
   - Message handling and display
   - User interaction management

2. **Wallet Service** (`src/services/walletService.js`)

   - CDP SDK integration
   - Wallet operations (create, send, balance)
   - Account management

3. **Prompt Handler** (`src/services/promptHandler.js`)
   - Natural language processing
   - Command recognition and execution
   - Response formatting

### Security Features

- **Secure Key Management**: Private keys are secured in AWS Nitro Enclave TEE
- **Single Secret Authentication**: One secret for all accounts
- **Rotatable Secrets**: Change your secret anytime
- **Permission Controls**: Granular spending permissions

## API Reference

### Wallet Service Methods

```javascript
// Initialize wallet service
await walletService.initialize(walletSecret);

// Create EVM account
await walletService.createEVMAccount(name, network);

// Create Smart Account
await walletService.createSmartAccount(name, network);

// Get wallet address
await walletService.getWalletAddress(accountId);

// Get balance
await walletService.getWalletBalance(accountId, tokenAddress);

// Send tokens
await walletService.sendTokens(
  fromAccountId,
  toAddress,
  amount,
  tokenAddress,
  network
);

// Grant spend permission
await walletService.grantSpendPermission(
  accountId,
  spenderAddress,
  amount,
  tokenAddress
);

// Revoke spend permission
await walletService.revokeSpendPermission(
  accountId,
  spenderAddress,
  tokenAddress
);

// List accounts
await walletService.listAccounts();
```

### Prompt Handler Methods

```javascript
// Process natural language prompt
await promptHandler.processPrompt(prompt, context);

// Get command suggestions
promptHandler.getSuggestions(partialPrompt);
```

## Error Handling

The AI Agent includes comprehensive error handling:

- **Network Errors**: Automatic retry and user feedback
- **Invalid Commands**: Helpful suggestions and guidance
- **Transaction Failures**: Clear error messages and next steps
- **Authentication Errors**: Secure error handling for wallet secrets

## Best Practices

### Security

1. **Never share your Wallet Secret**: Keep it secure and private
2. **Use Test Networks**: Test with sandbox environment first
3. **Review Permissions**: Regularly audit spend permissions
4. **Monitor Transactions**: Keep track of all wallet activities

### Usage

1. **Start Simple**: Begin with basic commands like "create wallet"
2. **Use Specific Amounts**: Be precise with transaction amounts
3. **Verify Addresses**: Double-check recipient addresses
4. **Test Small Amounts**: Send small amounts first for testing

## Troubleshooting

### Common Issues

1. **"Wallet not initialized"**

   - Ensure you've entered a valid Wallet Secret
   - Check your internet connection
   - Verify your CDP account is active

2. **"Command not recognized"**

   - Use the help command to see available options
   - Try more specific language
   - Check for typos in addresses

3. **"Transaction failed"**

   - Verify you have sufficient balance
   - Check the recipient address is valid
   - Ensure you're on the correct network

4. **"Permission denied"**
   - Check if you have the required permissions
   - Verify the account ID is correct
   - Ensure the wallet is properly initialized

### Getting Help

- Use the `help` command in the chat interface
- Check the console for detailed error messages
- Review the Coinbase CDP documentation
- Contact support if issues persist

## Development

### Adding New Commands

To add new commands, update the `promptHandler.js` file:

```javascript
// Add new command to commands object
'new command': this.handleNewCommand,

// Implement the handler
async handleNewCommand(prompt, context) {
  // Your command logic here
  return {
    success: true,
    message: 'Command executed successfully'
  };
}
```

### Customizing Responses

Modify the response formatting in the `AIAgent` component:

```javascript
const formatMessage = (message) => {
  // Custom formatting logic
  return formattedMessage;
};
```

## License

This AI Agent is part of the payroll project and follows the same license terms.

## Support

For support and questions:

- Check the [Coinbase CDP Documentation](https://docs.cdp.coinbase.com)
- Review the project's main README
- Contact the development team

---

**Note**: This AI Agent is designed for development and testing purposes. For production use, ensure proper security measures and compliance with relevant regulations.



