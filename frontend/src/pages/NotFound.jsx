import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiXCircle } from "react-icons/fi";
import BorderGlowBtn from "../components/BorderGlowBtn";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 text-center relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-blue-900/20 blur-[150px] rounded-full point-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-black/50 backdrop-blur-xl p-10 rounded-3xl border border-neutral-800 shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <FiXCircle className="mx-auto text-blue-500 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" size={80} />
        </motion.div>
        
        <h1 className="text-7xl font-black text-white tracking-tighter mb-2">404</h1>
        <h2 className="text-2xl font-bold text-blue-300 mb-4">Lost in the void</h2>
        <p className="text-blue-200/60 mb-10 leading-relaxed max-w-sm mx-auto">
          We couldn't find the page you're looking for. It might have been moved or specifically deleted.
        </p>

        <div className="w-56 mx-auto">
          <Link to="/">
            <BorderGlowBtn>Return to Dashboard</BorderGlowBtn>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
