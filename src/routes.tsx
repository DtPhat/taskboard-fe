import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { BoardList } from "./pages/BoardList";
import { BoardDetail } from "./pages/BoardDetail";
import { Navigation } from "./components/Navigation";
import { PrivateRoute } from "./components/PrivateRoute";
import BoardLayout from "./components/BoardLayout";

export function AppRoutes() {
  return (
    <div className="bg-gray-50">
      <Navigation />
      <main>
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
  );
} 