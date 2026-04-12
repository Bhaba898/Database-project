import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import customFetch from "../api";
import { AuthContext } from "../context/AuthContext";
import BorderGlowBtn from "../components/BorderGlowBtn";

const Login = () => {
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await customFetch("/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      login();
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-black/50 backdrop-blur-xl p-8 rounded-2xl border border-blue-900 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-black font-bold text-3xl shadow-lg shadow-red-600/30">
            E
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-blue-300 mt-2">Login to manage your expenses</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-500/10 border border-red-500/50 text-blue-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-black/50 border border-blue-900 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all text-white outline-none"
              placeholder="Enter your username"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-black/50 border border-blue-900 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all text-white outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <BorderGlowBtn
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Sign In"
            )}
          </BorderGlowBtn>
        </form>

        <p className="mt-8 text-center text-blue-300 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
