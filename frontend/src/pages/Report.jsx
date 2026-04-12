import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import customFetch from "../api";
import { FiCheckCircle, FiAlertCircle, FiActivity, FiDownload } from "react-icons/fi";
import BorderGlowBtn from "../components/BorderGlowBtn";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const Report = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await customFetch("/expenses/getReport");
        if (data && !data.error && !data.message?.includes("No expenses")) {
          // If the backend failed to parse JSON properly and just sent raw string:
          if (data.raw) {
            setError(`Failed to parse AI output. Raw: ${data.raw.substring(0,100)}...`);
            setReport(null);
          } else {
            setReport(data);
          }
        } else {
          setError(data?.message || "No data to analyze.");
        }
      } catch (e) {
        setError("Failed to fetch report from AI");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleDownload = async () => {
    if (!report) return;
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; background: white; color: black; width: 800px; line-height: 1.5;">
        <h1 style="color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 25px; font-size: 32px">AI Spending Analysis</h1>
        <p style="color: #64748b; font-size: 14px;"><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
        
        <h2 style="color: #1e40af; margin-top: 35px; font-size: 24px">Executive Summary</h2>
        <p style="font-size: 16px;">${report.summary}</p>
        
        <h2 style="color: #1e40af; margin-top: 35px; font-size: 24px">Key Metrics</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 30%">Total Spent:</td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 18px; color: #0f172a;">$${report.total_spent}</td></tr>
          <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Highest Month:</td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${report.highest_spending_month}</td></tr>
          <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Lowest Month:</td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${report.lowest_spending_month}</td></tr>
          <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Top Category:</td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #2563eb; font-weight: bold;">${report.highest_spending_category}</td></tr>
        </table>
        
        <h2 style="color: #1e40af; margin-top: 35px; font-size: 24px">Behavioral Habits</h2>
        <p style="font-size: 16px;">${report.spending_habits}</p>
      </div>
    `;

    // Position off-screen so user doesn't see it snapping
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    document.body.appendChild(tempDiv);
    
    try {
      const canvas = await html2canvas(tempDiv.firstElementChild, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Spending_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            AI Spending Analysis
          </h1>
          <p className="text-blue-300">Smart insights generated from your expense history</p>
        </div>
        {report && !loading && (
          <div className="w-48">
            <BorderGlowBtn onClick={handleDownload} className="text-sm">
              <div className="flex items-center gap-2">
                <FiDownload size={18} /> Download PDF
              </div>
            </BorderGlowBtn>
          </div>
        )}
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-black rounded-2xl border border-blue-900/50 border-dashed">
          <div className="w-12 h-12 border-4 border-blue-900/50 border-t-red-500 rounded-full animate-spin mb-4"></div>
          <p className="text-blue-500 font-medium animate-pulse">Llama3 is analyzing your spending patterns...</p>
        </div>
      ) : error ? (
        <div className="bg-amber-500/10 border border-amber-500/50 p-6 rounded-2xl flex items-start gap-4">
          <FiAlertCircle className="text-amber-400 shrink-0 text-xl mt-1" />
          <div>
            <h3 className="text-amber-400 font-bold mb-1">Analysis Unavailable</h3>
            <p className="text-amber-200/70">{error}</p>
          </div>
        </div>
      ) : report ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y:0 }} transition={{ delay: 0.1 }}
            className="col-span-full bg-gradient-to-br from-blue-950 to-black p-8 rounded-2xl shadow-xl border border-blue-900/50"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-blue-500" /> Executive Summary
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed">{report.summary}</p>
          </motion.div>

          {/* Highlights */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x:0 }} transition={{ delay: 0.2 }}
            className="bg-black backdrop-blur p-6 rounded-2xl border border-blue-900/50"
          >
            <h3 className="text-lg font-semibold text-white mb-6 border-b border-blue-900/50 pb-2">Key Metrics</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-blue-300">Total Spent</span>
                <span className="text-xl font-bold text-white">${report.total_spent}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-blue-300">Highest Month</span>
                <span className="bg-blue-950 px-3 py-1 rounded text-sm text-white font-medium">{report.highest_spending_month}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-blue-300">Lowest Month</span>
                <span className="bg-blue-950 px-3 py-1 rounded text-sm text-white font-medium">{report.lowest_spending_month}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-blue-300">Top Category</span>
                <span className="text-blue-500 font-semibold">{report.highest_spending_category}</span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x:0 }} transition={{ delay: 0.3 }}
            className="bg-black backdrop-blur p-6 rounded-2xl border border-blue-900/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-blue-900/50 pb-2 flex items-center gap-2">
              <FiActivity className="text-blue-500" /> Behavioral Habits
            </h3>
            <p className="text-blue-200 leading-relaxed">
              {report.spending_habits}
            </p>
          </motion.div>

        </div>
      ) : null}
    </motion.div>
  );
};

export default Report;
