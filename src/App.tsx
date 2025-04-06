
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import PrivateRoute from "@/components/auth/PrivateRoute";
import WelcomePage from "./pages/WelcomePage";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Finance from "./pages/Finance";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            
            {/* Protected Routes with AppLayout */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/market" 
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Market />
                  </AppLayout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/finance" 
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Finance />
                  </AppLayout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/insights" 
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Insights />
                  </AppLayout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </PrivateRoute>
              } 
            />
            
            {/* Update the Index route to redirect to either dashboard or welcome page */}
            <Route path="/index" element={<Navigate to="/" replace />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
