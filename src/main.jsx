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
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { baseSepolia } from "wagmi/chains";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThirdwebProvider
      activeChain={baseSepolia}
      clientId="a4c881491718c955361b7b67fdb590aa" // Replace with your Thirdweb client ID
      // supportedChains={[baseSepolia]}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
          <App />
          <Toaster position="bottom-center" />
        </AuthProvider>
      </QueryClientProvider>
    </ThirdwebProvider>
  </StrictMode>
);
