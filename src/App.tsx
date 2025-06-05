import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './lib/auth-context';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navigation } from './components/Navigation';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { BoardList } from './components/BoardList';
import { BoardDetail } from './components/BoardDetail';
import { CardDetail } from './components/CardDetail';
import { useAuth } from './lib/auth-context';
import './App.css';

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
  console.log(isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="py-10">
              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route
                    path="/boards"
                    element={
                      <PrivateRoute>
                        <BoardList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/boards/:boardId"
                    element={
                      <PrivateRoute>
                        <BoardDetail />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/boards/:boardId/cards/:cardId"
                    element={
                      <PrivateRoute>
                        <CardDetail />
                      </PrivateRoute>
                    }
                  />
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
