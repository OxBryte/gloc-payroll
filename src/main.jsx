import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// Supports weights 100-900
import "@fontsource-variable/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./components/context/AuthContext.jsx";
import { PrivyProvider } from "@privy-io/react-auth";
import { sepolia } from "viem/chains";
import { http } from "wagmi";
import { createConfig, WagmiProvider } from "@privy-io/wagmi";

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
    // For each of your required chains, add an entry to `transports` with
    // a key of the chain's `id` and a value of `http()`
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrivyProvider
      appId="cmbinutss00nol20mlj1b33bp" // Get this from Privy dashboard
      config={{
        appearance: {
          theme: "light",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <AuthProvider>
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-left"
            />
            <App />
            <Toaster position="bottom-center" />
          </AuthProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  </StrictMode>
);
