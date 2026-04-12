import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import customFetch from "../api";
import BorderGlowBtn from "../components/BorderGlowBtn";

const Register = () => {
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await customFetch("/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-black/50 backdrop-blur-xl p-8 rounded-2xl border border-blue-900 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-blue-300">Join us to start tracking expenses</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-500/10 border border-red-500/50 text-blue-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-500/10 border border-red-500/50 text-blue-400 p-3 rounded-lg mb-6 text-sm text-center">
            Registration successful! Redirecting to login...
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-black/50 border border-blue-900 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all text-white outline-none"
              placeholder="Choose a username"
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
            <p className="mt-2 text-xs text-blue-400">Must be at least 8 chars, 1 number, 1 special char</p>
          </div>

          <BorderGlowBtn
            type="submit"
            disabled={success || isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Sign Up"
            )}
          </BorderGlowBtn>
        </form>

        <p className="mt-8 text-center text-blue-300 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
