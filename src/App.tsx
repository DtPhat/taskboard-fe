import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/lib/auth-context";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navigation } from "./components/Navigation";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { BoardList } from "./pages/BoardList";
import { BoardDetail } from "./pages/BoardDetail";
import { useAuth } from "./contexts/lib/auth-context";
import BoardLayout from "./components/BoardLayout";
import { notificationService } from '@/services/notificationService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
}

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
        <Router>
          <div className="bg-gray-50">
            <Navigation />
            <main className="">
              <div className="sm:px-1 lg:px-1">
                <Routes>
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route
                    path="/boards"
                    element={
                      <PrivateRoute>
                        <BoardLayout />
                      </PrivateRoute>
                    }
                  >
                    <Route index element={<BoardList />} />
                    <Route path=":boardId" element={<BoardDetail />} />
                  </Route>
                  <Route path="/" element={<Navigate to="/boards" />} />
                </Routes>
              </div>
            </main>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
