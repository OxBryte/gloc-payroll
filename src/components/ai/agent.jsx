import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Wallet,
  Shield,
  DollarSign,
  Copy,
  Check,
} from "lucide-react";
import walletService from "../../services/walletService.js";
import promptHandler from "../../services/promptHandler.js";
import toast from "react-hot-toast";

const AIAgent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [walletSecret, setWalletSecret] = useState("");
  const [showSecretInput, setShowSecretInput] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if wallet is already initialized
    if (walletService.isReady()) {
      setIsInitialized(true);
      setShowSecretInput(false);
      addMessage(
        "bot",
        "Welcome back! Your wallet is ready. How can I help you today?"
      );
    } else {
      addMessage(
        "bot",
        "Welcome! I'm your AI Wallet Agent. Please enter your Coinbase CDP Wallet Secret to get started."
      );
    }
  }, []);

  const addMessage = (sender, content, data = null) => {
    const newMessage = {
      id: Date.now(),
      sender,
      content,
      data,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleInitialize = async () => {
    if (!walletSecret.trim()) {
      toast.error("Please enter your wallet secret");
      return;
    }

    setIsLoading(true);
    const result = await walletService.initialize(walletSecret);

    if (result.success) {
      setIsInitialized(true);
      setShowSecretInput(false);
      addMessage(
        "bot",
        "✅ Wallet initialized successfully! You can now create accounts, check balances, and send transactions."
      );
      toast.success("Wallet initialized successfully!");
    } else {
      addMessage("bot", `❌ Failed to initialize wallet: ${result.error}`);
      toast.error("Failed to initialize wallet");
    }
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    addMessage("user", userMessage);
    setIsLoading(true);

    try {
      const result = await promptHandler.processPrompt(userMessage);

      if (result.success) {
        addMessage("bot", result.message, result.data);
        if (result.data?.transactionHash) {
          toast.success("Transaction successful!");
        }
      } else {
        addMessage(
          "bot",
          result.message || "Sorry, I couldn't process that request."
        );
        if (result.suggestions) {
          addMessage(
            "bot",
            `💡 Try these commands: ${result.suggestions.join(", ")}`
          );
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
      addMessage(
        "bot",
        "Sorry, an error occurred while processing your request."
      );
      toast.error("Error processing request");
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(type);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedAddress(""), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const formatMessage = (message) => {
    // Format addresses and transaction hashes
    let formatted = message.content;

    // Format Ethereum addresses
    formatted = formatted.replace(/0x[a-fA-F0-9]{40}/g, (match) => {
      const shortAddress = `${match.slice(0, 6)}...${match.slice(-4)}`;
      return (
        <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm font-mono">
          {shortAddress}
          <button
            onClick={() => copyToClipboard(match, "address")}
            className="text-gray-500 hover:text-gray-700"
          >
            {copiedAddress === "address" ? (
              <Check size={12} />
            ) : (
              <Copy size={12} />
            )}
          </button>
        </span>
      );
    });

    // Format transaction hashes
    formatted = formatted.replace(/0x[a-fA-F0-9]{64}/g, (match) => {
      const shortHash = `${match.slice(0, 10)}...${match.slice(-8)}`;
      return (
        <span className="inline-flex items-center gap-1 bg-blue-100 px-2 py-1 rounded text-sm font-mono">
          {shortHash}
          <button
            onClick={() => copyToClipboard(match, "tx")}
            className="text-blue-500 hover:text-blue-700"
          >
            {copiedAddress === "tx" ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </span>
      );
    });

    return formatted;
  };

  const getMessageIcon = (sender) => {
    if (sender === "user") return <User size={16} className="text-blue-500" />;
    return <Bot size={16} className="text-green-500" />;
  };

  const getQuickActions = () => {
    if (!isInitialized) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setInput("create wallet")}
          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Wallet size={16} />
          Create Wallet
        </button>
        <button
          onClick={() => setInput("check balance")}
          className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <DollarSign size={16} />
          Check Balance
        </button>
        <button
          onClick={() => setInput("wallet address")}
          className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <Wallet size={16} />
          Get Address
        </button>
        <button
          onClick={() => setInput("list accounts")}
          className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
        >
          <Shield size={16} />
          List Accounts
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Bot className="text-blue-500" size={32} />
          AI Wallet Agent
        </h1>
        <p className="text-gray-600">
          Your intelligent assistant for blockchain transactions using Coinbase
          Server Wallet v2
        </p>
      </div>

      {showSecretInput && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Initialize Wallet
          </h3>
          <p className="text-yellow-700 text-sm mb-3">
            Enter your Coinbase CDP Wallet Secret to get started. This will be
            used to authenticate with the CDP API.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={walletSecret}
              onChange={(e) => setWalletSecret(e.target.value)}
              placeholder="Enter your wallet secret..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleInitialize}
              disabled={isLoading || !walletSecret.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Initializing..." : "Initialize"}
            </button>
          </div>
        </div>
      )}

      {getQuickActions()}

      <div className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  {getMessageIcon(message.sender)}
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {formatMessage(message)}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                </div>
              </div>
              {message.sender === "user" && (
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {getMessageIcon(message.sender)}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-green-500" />
              </div>
              <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isInitialized
              ? "Ask me to create wallets, check balances, send tokens..."
              : "Enter your wallet secret first..."
          }
          disabled={!isInitialized}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading || !isInitialized}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send size={16} />
          Send
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>
          💡 Try commands like: "create wallet", "check balance", "send 0.1 ETH
          to 0x...", "help"
        </p>
      </div>
    </div>
  );
};

export default AIAgent;
