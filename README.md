# Glöc - Decentralized Payroll Management System

> Streamline your crypto payroll with Glöc. Manage employees, process payments, and handle payroll with ease using blockchain technology.

A modern, decentralized payroll management system built with React, enabling seamless crypto payments to employees using USDC on the Base network.

## 📋 Quick Reference

| Item                   | Details                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| **Network**            | Base Mainnet                                                                             |
| **Payroll Contract**   | `0x69b04e89dF5B1dD7Bed665D3B1009F7AF563a171`                                             |
| **USDC Contract**      | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`                                             |
| **Website**            | [https://gloc.pro](https://gloc.pro)                                                     |
| **BaseScan (Payroll)** | [View Contract](https://basescan.org/address/0x69b04e89dF5B1dD7Bed665D3B1009F7AF563a171) |

## 🌟 Features

### 💼 Workspace Management

- **Multi-workspace Support**: Create and manage multiple workspace organizations
- **Role-based Access**: Add admins with specific permissions to manage workspaces
- **Workspace Analytics**: Track payroll statistics, employee counts, and payment history
- **Admin Invitations**: Invite team members to collaborate on workspace management

### 👥 Employee Management

- **Employee Registry**: Add, update, and manage employee records
- **Bulk Import**: Import employees via CSV templates
- **Wallet Integration**: Store employee wallet addresses for direct payments
- **Employee Analytics**: View individual payment history and salary information
- **Custom Fields**: Track position, salary, and other employee details

### 💰 Payroll Processing

- **Bulk Payroll Distribution**: Pay multiple employees in a single transaction
- **USDC Payments**: Process payments using USDC stablecoin
- **Automated Tax Calculation**: Built-in 3% tax calculation on payroll
- **Transaction Tracking**: Monitor all payroll transactions with on-chain verification
- **Payment History**: Complete audit trail of all payroll distributions

### 🔐 Smart Contract Integration

- **Secure Distribution**: Smart contract-powered payroll distribution
- **USDC Approval Flow**: Automated token approval before distribution
- **Multi-recipient Batching**: Efficient gas usage with bulk payment processing
- **Transaction Receipts**: On-chain verification of all payments

### 📊 Analytics & Reporting

- **Payment Analytics**: Visual charts showing payroll distribution over time
- **Employee Statistics**: Track total employees and payment patterns
- **Workspace Overview**: Comprehensive dashboard for each workspace
- **Transaction History**: Detailed records with BaseScan integration

### 🔌 Wallet Connection

- **Multi-wallet Support**: Connect via MetaMask, WalletConnect, Coinbase Wallet, and more
- **Network Switching**: Seamless switching between Base networks
- **Account Management**: View balance, disconnect, and switch accounts
- **Session Persistence**: Stay connected across browser sessions

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Web3 wallet (MetaMask recommended)
- USDC on Base network for testing/production

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/oxbryte/payroll-project.git
cd payroll-project
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure Reown AppKit**

   - Visit [Reown Dashboard](https://dashboard.reown.com)
   - Create a new project and get your Project ID
   - Update the project ID in `src/Provider.jsx`:

   ```javascript
   const projectId = "your-project-id-here";
   ```

4. **Configure Backend API** (if applicable)

   - Update API endpoints in `src/components/services/client.js`

5. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Access the application**
   - Open [http://localhost:5173](http://localhost:5173) in your browser

## 🛠️ Tech Stack

### Frontend

- **React 18.3** - Modern React with hooks and concurrent features
- **Vite 6.3** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **React Router DOM 7.6** - Client-side routing
- **React Hook Form 7.56** - Performant form validation

### Blockchain & Web3

- **Wagmi 2.18** - React hooks for Ethereum
- **Viem 2.38** - TypeScript interface for Ethereum
- **@reown/appkit 1.8** - Modern wallet connection (formerly WalletConnect)
- **Ethers 5.8** - Ethereum wallet implementation
- **Thirdweb** - Additional Web3 utilities

### State Management & Data

- **TanStack Query 5.90** - Powerful async state management
- **Axios 1.9** - HTTP client for API requests
- **React Hot Toast 2.5** - Beautiful notifications

### Charts & Analytics

- **ApexCharts 4.7** - Modern charting library
- **Recharts 2.15** - Composable charting library
- **React ApexCharts 1.7** - React wrapper for ApexCharts

### Utilities

- **Lucide React 0.511** - Beautiful icon set
- **Moment 2.30** - Date manipulation
- **PapaParse 5.5** - CSV parser for employee imports

## 📁 Project Structure

```
payroll-project/
├── public/                    # Static assets
│   ├── employee-template.csv  # Template for bulk employee import
│   └── *.svg                  # Icons and logos
├── src/
│   ├── components/
│   │   ├── constants/         # Smart contract ABIs and addresses
│   │   ├── context/           # React context providers
│   │   ├── features/          # Feature-specific components
│   │   │   ├── Analytics/     # Analytics components
│   │   │   ├── settings/      # Settings pages
│   │   │   └── workspace/     # Workspace features
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── usePayrollWrite.js    # Payroll distribution hooks
│   │   │   ├── useApproveUsdc.js     # USDC approval hooks
│   │   │   ├── useEmployee.js        # Employee management
│   │   │   └── useWorkspace.js       # Workspace operations
│   │   ├── layouts/           # Layout components
│   │   ├── lib/               # Utility functions and configs
│   │   ├── services/          # API service layer
│   │   └── ui/                # Reusable UI components
│   ├── pages/                 # Route page components
│   │   ├── Home.jsx
│   │   ├── CreatePayroll.jsx
│   │   ├── Workspace.jsx
│   │   └── Settings.jsx
│   ├── App.jsx               # Main app component
│   ├── Provider.jsx          # Reown AppKit provider
│   └── main.jsx              # Application entry point
└── package.json
```

## 🔑 Key Features Explained

### Payroll Distribution Flow

1. **Employee Setup**: Add employees with wallet addresses
2. **USDC Balance Check**: System verifies sufficient USDC balance
3. **Token Approval**: Approve USDC spending for the payroll contract
4. **Distribution**: Execute bulk payment to all selected employees
5. **Confirmation**: Wait for on-chain confirmation
6. **Record Creation**: Save payroll record to database
7. **Receipt**: View transaction on BaseScan

### Smart Contract Hooks

#### `useDistributeBulk`

Handles bulk payroll distribution with transaction confirmation and database record creation.

```javascript
const {
  distributeBulk,
  isDistributing,
  isConfirming,
  isCreatingRecord,
  isSuccess,
  txHash,
} = useDistributeBulk(payrollData);
```

#### `useApproveUsdc`

Manages USDC token approvals for the payroll contract.

```javascript
const {
  usdcBalance,
  isApproving,
  approveUsdc,
  needsApproval,
  hasSufficientBalance,
} = useApproveUsdc(address, isConnected);
```

## 🌐 Supported Networks

- **Base Mainnet** (Primary)
- **Base Sepolia** (Testnet)

Additional networks can be added in `src/Provider.jsx`:

```javascript
import { base, baseSepolia, arbitrum } from "@reown/appkit/networks";

const networks = [base, baseSepolia, arbitrum];
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Reown Project ID
VITE_REOWN_PROJECT_ID=your_project_id

# Backend API URL
VITE_API_URL=your_api_endpoint

# Contract Addresses (Base Mainnet)
VITE_PAYROLL_CONTRACT_ADDRESS=0x69b04e89dF5B1dD7Bed665D3B1009F7AF563a171
VITE_USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

## 📝 Smart Contract Integration

The project interacts with custom smart contracts for payroll distribution on the **Base Network**.

### Contract Addresses

#### Payroll Contract (Base Mainnet)

```
0x69b04e89dF5B1dD7Bed665D3B1009F7AF563a171
```

**View on BaseScan**: [https://basescan.org/address/0x69b04e89dF5B1dD7Bed665D3B1009F7AF563a171](https://basescan.org/address/0x69b04e89dF5B1dD7Bed665D3B1009F7AF563a171)

#### USDC Contract (Base Mainnet)

```
0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

**View on BaseScan**: [https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913](https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)

### Smart Contract Functions

- **distributeBulk**: Pays multiple employees in one transaction (bulk distribution)
- **distribute**: Single employee payment
- **pause/unpause**: Emergency contract pause functionality (admin only)
- **setTaxPercentage**: Update the tax percentage (admin only)
- **emergencyWithdraw**: Emergency token withdrawal (admin only)
- **USDC Approval**: ERC-20 approve function for token spending before distribution

### Contract Architecture

The payroll smart contract is built with:

- **OpenZeppelin Libraries**: Using battle-tested security standards
- **Ownable**: Only contract owner can perform admin functions
- **Pausable**: Emergency pause mechanism for security
- **ReentrancyGuard**: Protection against reentrancy attacks
- **SafeERC20**: Safe token transfer operations

Contract ABIs and interfaces are located in `src/components/constants/contractABI.js`.

## 🧪 Testing

### Local Development

1. Use Base Sepolia testnet for testing
2. Get test USDC from faucets
3. Test with small amounts before production

### Production Checklist

- [ ] Verify contract addresses on Base Mainnet
- [ ] Test USDC approval flow
- [ ] Confirm payroll distribution
- [ ] Verify transaction on BaseScan
- [ ] Check database record creation

## 🎨 Customization

### Branding

Update metadata in `src/Provider.jsx`:

```javascript
const metadata = {
  name: "Your App Name",
  description: "Your app description",
  url: "https://yourapp.com",
  icons: ["https://yourapp.com/logo.svg"],
};
```

### Styling

Tailwind configuration is in `tailwind.config.js`. Customize colors, fonts, and themes.

### Tax Rate

Adjust the tax rate in `src/pages/CreatePayroll.jsx`:

```javascript
const taxRate = 0.03; // 3% - Change as needed
```

## 🐛 Troubleshooting

### Common Issues

**Wallet not connecting**

- Clear browser cache and cookies
- Try a different wallet provider
- Check if you're on the correct network

**Transaction failing**

- Ensure sufficient USDC balance
- Verify enough ETH for gas fees
- Check if USDC approval is needed
- Confirm you're on Base network

**"No transaction hash returned"**

- This occurs if transaction is rejected in wallet
- Check wallet for pending transactions
- Ensure correct network selection

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m "Add amazing feature"
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📧 Contact & Support

- **Email**: oxbryte@gmail.com
- **Website**: [https://gloc.pro](https://gloc.pro)
- **GitHub**: [https://github.com/oxbryte/payroll-project](https://github.com/oxbryte/payroll-project)

## 🙏 Acknowledgments

- [Reown (WalletConnect)](https://reown.com) for wallet connection infrastructure
- [Wagmi](https://wagmi.sh) for React hooks for Ethereum
- [Base](https://base.org) for the blockchain infrastructure
- [Viem](https://viem.sh) for TypeScript Ethereum interface

## 📊 Project Status

🚀 **Active Development** - Regular updates and improvements

---

Built with ❤️ by the Glöc Team
