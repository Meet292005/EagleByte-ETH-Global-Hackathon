import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { wagmiConfig } from "@/lib/web3Config";
import { usePostHog } from "posthog-js/react";
import { isPostHogConfigured } from "@/lib/analytics";
import ThemeProvider from "./components/ThemeProvider";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Web3Pay from "./pages/Web3Pay";
import EscrowDashboard from "./pages/EscrowDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function PostHogPageView() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    if (!isPostHogConfigured) {
      return;
    }

    posthog.capture("$pageview", {
      $current_url: window.location.href,
      path: location.pathname,
    });
  }, [location, posthog]);

  return null;
}

const App = () => {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              initialChain={sepolia}
              theme={darkTheme({
                accentColor: '#8b5cf6',
                accentColorForeground: 'white',
                borderRadius: 'medium',
              })}
            >
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <PostHogPageView />
                  <ScrollToTop />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/pay" element={<Web3Pay />} />
                    <Route path="/escrow" element={<EscrowDashboard />} />
                    <Route path="/admin" element={<Admin />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
