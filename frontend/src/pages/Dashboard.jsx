import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Line, Doughnut } from "react-chartjs-2";
import customFetch from "../api";
import { FiTrendingUp, FiPieChart } from "react-icons/fi";

const Dashboard = () => {
  const [monthData, setMonthData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthRes, catRes] = await Promise.all([
          customFetch("/expenses/spendingPerMonth"),
          customFetch("/expenses/spendingPerCategory")
        ]);
        setMonthData(Array.isArray(monthRes) ? monthRes : []);
        setCategoryData(Array.isArray(catRes) ? catRes : []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSpent = categoryData.reduce((acc, curr) => acc + Number(curr.total), 0);

  const lineChartData = {
    labels: monthData.map(d => d.month),
    datasets: [
      {
        label: "Spending",
        data: monthData.map(d => Number(d.total)),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: "rgba(148, 163, 184, 0.1)" }, ticks: { color: "#94a3b8" } },
      x: { grid: { color: "rgba(148, 163, 184, 0.1)" }, ticks: { color: "#94a3b8" } }
    }
  };

  const colors = [
    "#3b82f6", "#1d4ed8", "#1e3a8a", "#0ea5e9", "#2563eb", "#1e40af", "#3b82f6", "#60a5fa"
  ];

  const doughnutData = {
    labels: categoryData.map(d => d.category),
    datasets: [
      {
        data: categoryData.map(d => Number(d.total)),
        backgroundColor: colors,
        borderWidth: 0,
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right", labels: { color: "#e2e8f0" } }
    },
    cutout: "70%"
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-blue-500">Loading dashboard...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-blue-300">Overview of your expenses</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-black backdrop-blur border border-blue-900/50 p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FiDollarSign size={80} />
          </div>
          <p className="text-blue-300 font-medium mb-1">Total Spent</p>
          <h2 className="text-4xl font-bold text-white">${totalSpent.toFixed(2)}</h2>
        </motion.div>
        {categoryData.length > 0 && (
          <motion.div whileHover={{ scale: 1.02 }} className="bg-black backdrop-blur border border-blue-900/50 p-6 rounded-2xl shadow-lg">
            <p className="text-blue-300 font-medium mb-1">Top Category</p>
            <h2 className="text-2xl font-bold text-white capitalize">{categoryData[0].category}</h2>
            <p className="text-blue-500 text-sm mt-1">${Number(categoryData[0].total).toFixed(2)}</p>
          </motion.div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black backdrop-blur border border-blue-900/50 p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-blue-500" /> Monthly Trend
          </h3>
          {monthData.length > 0 ? (
            <div className="h-64"><Line data={lineChartData} options={lineChartOptions} /></div>
          ) : (
            <p className="text-blue-400 text-center mt-20">No data available.</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-black backdrop-blur border border-blue-900/50 p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FiPieChart className="text-blue-500" /> Category Breakdown
          </h3>
          {categoryData.length > 0 ? (
            <div className="h-64 flex justify-center"><Doughnut data={doughnutData} options={doughnutOptions} /></div>
          ) : (
            <p className="text-blue-400 text-center mt-20">No data available.</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
// A little helper icon that was missing from import
import { FiDollarSign } from "react-icons/fi";
