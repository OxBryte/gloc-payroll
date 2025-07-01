# Payroll Project

A decentralized payroll management system built with React and Thirdweb for wallet integration.

## Features

- **Wallet Connection**: Connect your wallet using Thirdweb
- **Payroll Management**: Create and manage payroll records
- **Employee Management**: Add and manage employees
- **Multi-chain Support**: Support for multiple blockchain networks
- **USDC Integration**: Pay employees using USDC tokens

## Wallet Integration

This project uses **Thirdweb** for wallet connection instead of traditional email/password authentication. Users can:

1. Connect their wallet (MetaMask, WalletConnect, etc.)
2. View their connected address
3. Disconnect their wallet when needed

## Setup

1. Install dependencies:

```bash
npm install
```

2. Get your Thirdweb Client ID:

   - Go to [Thirdweb Dashboard](https://thirdweb.com/dashboard)
   - Create a new project
   - Copy your Client ID
   - Replace `"your-thirdweb-client-id"` in `src/main.jsx` with your actual Client ID

3. Start the development server:

```bash
npm run dev
```

## Key Components

- **ConnectButton**: Handles wallet connection using Thirdweb
- **useAuth Hook**: Provides authentication state and methods
- **ProtectedRoute**: Protects routes that require wallet connection

## Authentication Flow

1. User visits the app
2. If not connected, they're redirected to the login page
3. User clicks "Connect Wallet" button
4. Thirdweb modal opens for wallet selection
5. User connects their wallet
6. User is redirected to the main application

## Environment Variables

Make sure to set up your Thirdweb Client ID in the main.jsx file:

```javascript
<ThirdwebProvider
  activeChain={Sepolia}
  clientId="your-actual-thirdweb-client-id"
>
```

## Supported Networks

Currently configured for Sepolia testnet, but can be easily changed to other networks supported by Thirdweb.

## Overview

The Payroll Project is a comprehensive system designed to manage employee payroll efficiently. It automates salary calculations, tax deductions, and generates detailed reports, ensuring accuracy and compliance with payroll regulations.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/oxbryte/payroll-project.git
   ```
2. Navigate to the project directory:
   ```bash
   cd payroll-project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```

## Usage

1. Access the application at `http://localhost:3000`.
2. Add employees and configure payroll settings.
3. Process payroll and generate reports.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Styling**: Tailwind CSS

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact [oxbryte@gmail.com].
