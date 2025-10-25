import React from "react";
import {
  Bot,
  Wallet,
  Shield,
  DollarSign,
  Send,
  Copy,
  CheckCircle,
} from "lucide-react";

const AIAgentDemo = () => {
  const features = [
    {
      icon: <Wallet className="text-blue-500" size={24} />,
      title: "Create Wallets",
      description:
        "Create EVM wallets and Smart Accounts with natural language commands",
      example: '"create wallet" or "create smart account"',
    },
    {
      icon: <DollarSign className="text-green-500" size={24} />,
      title: "Check Balances",
      description: "Get wallet balances for native tokens and ERC-20 tokens",
      example: '"check balance" or "how much do I have"',
    },
    {
      icon: <Send className="text-purple-500" size={24} />,
      title: "Send Tokens",
      description: "Send native tokens and ERC-20 tokens to any address",
      example: '"send 0.1 ETH to 0x123..."',
    },
    {
      icon: <Shield className="text-orange-500" size={24} />,
      title: "Spend Permissions",
      description: "Grant and revoke spending permissions for other addresses",
      example: '"grant 100 USDC spending to 0x123..."',
    },
  ];

  const commands = [
    "create wallet",
    "check balance",
    "wallet address",
    "send 0.1 ETH to 0x...",
    "list accounts",
    "grant spending permission",
    "help",
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Bot className="text-blue-500" size={48} />
          <h1 className="text-4xl font-bold text-gray-800">AI Wallet Agent</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your intelligent assistant for blockchain transactions using Coinbase
          Server Wallet v2. Interact with your wallet using natural language
          commands.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-3">{feature.description}</p>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <code className="text-sm text-gray-700">
                    {feature.example}
                  </code>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Supported Commands
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {commands.map((command, index) => (
            <div
              key={index}
              className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-center"
            >
              <code className="text-sm text-gray-700">{command}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <CheckCircle className="text-green-500 mx-auto mb-3" size={32} />
            <h3 className="font-semibold text-gray-800 mb-2">Secure</h3>
            <p className="text-gray-600 text-sm">
              Private keys secured in AWS Nitro Enclave TEE. Not even Coinbase
              can access them.
            </p>
          </div>
          <div className="text-center">
            <CheckCircle className="text-green-500 mx-auto mb-3" size={32} />
            <h3 className="font-semibold text-gray-800 mb-2">Multi-Network</h3>
            <p className="text-gray-600 text-sm">
              Works across Ethereum, Base, Polygon, Arbitrum, and Optimism
              networks.
            </p>
          </div>
          <div className="text-center">
            <CheckCircle className="text-green-500 mx-auto mb-3" size={32} />
            <h3 className="font-semibold text-gray-800 mb-2">Smart Accounts</h3>
            <p className="text-gray-600 text-sm">
              Support for EIP-4337 smart accounts with gas sponsorship and
              batching.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <a
          href="/ai-agent"
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
        >
          <Bot size={20} />
          Try the AI Agent
        </a>
      </div>
    </div>
  );
};

export default AIAgentDemo;



