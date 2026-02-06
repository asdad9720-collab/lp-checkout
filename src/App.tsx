import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Presell from "./pages/Presell";
import NotFound from "./pages/NotFound";
import { captureUtmFromUrl, saveTrackingParameters } from "@/lib/tracking";

const queryClient = new QueryClient();

const TrackingBridge = () => {
  const location = useLocation();

  useEffect(() => {
    const utmParams = captureUtmFromUrl();
    saveTrackingParameters(utmParams);
  }, [location.search]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TrackingBridge />
        <Routes>
          <Route path="/" element={<Presell />} />
          <Route path="/oferta" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
