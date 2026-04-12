import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Report from "./pages/Report";
import NotFound from "./pages/NotFound";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={ <Login /> } />
      <Route path="/register" element={ <Register /> } />
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/expenses" element={
        <ProtectedRoute>
          <AppLayout>
            <Expenses />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/report" element={
        <ProtectedRoute>
          <AppLayout>
            <Report />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={ <NotFound /> } />
    </Routes>
  );
}

export default App;
