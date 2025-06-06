import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Navigate, BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { SocketProvider } from "./contexts/socket-context";
import { AppRoutes } from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  // useEffect(() => {
  //   // Initialize socket connection with the current user's ID
  //   // You should get this from your auth context or similar
  //   const userId = localStorage.getItem('userId');
  //   if (userId) {
  //     notificationService.connect(userId);
  //   }

  //   return () => {
  //     notificationService.disconnect();
  //   };
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <AppRoutes />
          </Router>
        </SocketProvider>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
