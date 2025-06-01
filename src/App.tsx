import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navigation } from './components/Navigation';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="py-10">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                  path="/boards"
                  element={
                    <ProtectedRoute>
                      {/* TODO: Add BoardList component */}
                      <div>Boards Page</div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/boards/:boardId"
                  element={
                    <ProtectedRoute>
                      {/* TODO: Add BoardDetail component */}
                      <div>Board Detail Page</div>
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/boards" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
