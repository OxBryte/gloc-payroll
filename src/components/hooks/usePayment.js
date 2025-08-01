import { paymentMiddleware, Network } from 'x402-next';

// Configure the payment middleware
export const middleware = paymentMiddleware(
  "0xYourAddress", // your receiving wallet address 
  {  // Route configurations for protected endpoints
    '/protected': {
      price: '$0.01',
      network: "base-sepolia",
      config: {
        description: 'Access to protected content'
      }
    },
  },
  {
    url: "https://x402.org/facilitator", // Facilitator URL for Base Sepolia testnet. 
  }
);

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/protected/:path*',
  ]
};