
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ServiceProvider } from "./contexts/ServiceContext";
import { ConfigurationProvider } from "./contexts/ConfigurationContext";
import BasicAuth from "./components/BasicAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AllServices from "./pages/AllServices";
import AddService from "./pages/AddService";
import AllClients from "./pages/AllClients";
import AddClient from "./pages/AddClient";
import Reports from "./pages/Reports";
import ServiceExpiryReports from "./pages/ServiceExpiryReports";
import Settings from "./pages/Settings";
import Configuration from "./pages/Configuration";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BasicAuth>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <ServiceProvider>
            <ConfigurationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }>
                      <Route index element={<Dashboard />} />
                      <Route path="services" element={<AllServices />} />
                      <Route path="add-service" element={<AddService />} />
                      <Route path="clients" element={<AllClients />} />
                      <Route path="add-client" element={<AddClient />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="service-expiry-reports" element={<ServiceExpiryReports />} />
                      <Route path="configuration" element={<Configuration />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </ConfigurationProvider>
          </ServiceProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </BasicAuth>
);

export default App;
