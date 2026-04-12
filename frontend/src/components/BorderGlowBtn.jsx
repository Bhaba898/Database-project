import { useRef, useEffect } from "react";

const BorderGlowBtn = ({ children, onClick, disabled, className = "", type = "button" }) => {
  const btnRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btnRef.current.style.setProperty("--x", `${x}px`);
      btnRef.current.style.setProperty("--y", `${y}px`);
    };

    const handleMouseLeave = () => {
      if (!btnRef.current) return;
      btnRef.current.style.setProperty("--x", `-1000px`);
      btnRef.current.style.setProperty("--y", `-1000px`);
    };

    const currentRef = btnRef.current;
    if (currentRef) {
      currentRef.addEventListener("mousemove", handleMouseMove);
      currentRef.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("mousemove", handleMouseMove);
        currentRef.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <button
      type={type}
      ref={btnRef}
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full block overflow-hidden rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group bg-black shadow-lg shadow-blue-500/10 ${className}`}
    >
      {/* Background radial tracking the mouse */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "radial-gradient(120px circle at var(--x, -1000px) var(--y, -1000px), rgba(59, 130, 246, 1), transparent 100%)",
        }}
      />
      {/* Inner Mask that leaves the padding borders visible to create the border glow */}
      <div className="absolute inset-[2px] bg-black rounded-[0.65rem] z-10 backdrop-blur-xl" />
      
      {/* Content wrapper */}
      <div className="relative z-20 flex h-full w-full items-center justify-center py-3 px-4 text-blue-600 group-hover:text-blue-500 font-bold transition-colors">
        {children}
      </div>
    </button>
  );
};

export default BorderGlowBtn;
