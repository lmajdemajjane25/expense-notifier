
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ServiceProvider } from "./contexts/ServiceContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AllServices from "./pages/AllServices";
import AddService from "./pages/AddService";
import Reports from "./pages/Reports";
import ServiceExpiryReports from "./pages/ServiceExpiryReports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ServiceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="services" element={<AllServices />} />
                <Route path="add-service" element={<AddService />} />
                <Route path="reports" element={<Reports />} />
                <Route path="service-expiry-reports" element={<ServiceExpiryReports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ServiceProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
