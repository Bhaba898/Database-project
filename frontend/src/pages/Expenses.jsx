import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import customFetch from "../api";
import { FiPlus, FiX, FiFilter } from "react-icons/fi";
import BorderGlowBtn from "../components/BorderGlowBtn";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  
  // Filters
  const [filterCat, setFilterCat] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");

  const fetchExpenses = async () => {
    try {
      let endpoint = "/expenses/getExpense";
      if (filterCat !== "all") {
        endpoint = `/expenses/getExpense/category/${filterCat}`;
      } else if (filterMonth !== "all") {
        endpoint = `/expenses/getExpense/month/${filterMonth}`;
      }
      
      const res = await customFetch(endpoint);
      setExpenses(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error("Error fetching expenses", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await customFetch("/expenses/getCategories");
      setCategories(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchExpenses();
  }, [filterCat, filterMonth]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await customFetch("/expenses/addExpense", {
        method: "POST",
        body: JSON.stringify({ categoryId, amount: Number(amount), description })
      });
      setIsModalOpen(false);
      setAmount("");
      setDescription("");
      // Refresh
      fetchExpenses();
    } catch (e) {
      console.error("Failed to add", e);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Expenses</h1>
          <p className="text-blue-300">Manage all your spending history</p>
        </div>
        <div className="w-48">
          <BorderGlowBtn onClick={() => setIsModalOpen(true)}>
            <div className="flex items-center justify-center gap-2">
              <FiPlus /> Add Expense
            </div>
          </BorderGlowBtn>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex gap-4 items-center bg-black p-4 rounded-xl border border-blue-900/50">
        <FiFilter className="text-blue-300" />
        <select 
          className="bg-black border border-blue-900/50 text-white rounded-lg px-3 py-1.5 outline-none focus:border-red-500"
          value={filterCat}
          onChange={(e) => { setFilterCat(e.target.value); setFilterMonth("all"); }}
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select 
          className="bg-black border border-blue-900/50 text-white rounded-lg px-3 py-1.5 outline-none focus:border-red-500"
          value={filterMonth}
          onChange={(e) => { setFilterMonth(e.target.value); setFilterCat("all"); }}
        >
          <option value="all">All Months</option>
          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>
      </div>

      {/* Expenses Table */}
      <div className="bg-black backdrop-blur rounded-2xl border border-blue-900/50 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-blue-900/50 bg-black text-blue-200">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-blue-500">Loading expenses...</td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-blue-400">No expenses found.</td>
                </tr>
              ) : (
                <AnimatePresence>
                  {expenses.map((exp, idx) => (
                    <motion.tr 
                      key={exp.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-blue-900/50/50 hover:bg-blue-950 transition-colors"
                    >
                      <td className="p-4 text-blue-200 whitespace-nowrap">
                        {new Date(exp.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 capitalize">
                        <span className="bg-blue-950 px-2.5 py-1 rounded-full text-xs font-medium text-blue-400">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-4 text-blue-200 truncate max-w-[200px]">{exp.description}</td>
                      <td className="p-4 text-right font-bold text-white">${Number(exp.amount).toFixed(2)}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black rounded-2xl w-full max-w-md border border-blue-900/50 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-blue-900/50 bg-black">
                <h3 className="text-xl font-bold text-white">Add New Expense</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-blue-300 hover:text-white transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Amount</label>
                  <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)}
                    className="w-full bg-black border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none" 
                    placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Category</label>
                  <select required value={categoryId} onChange={e => setCategoryId(e.target.value)}
                    className="w-full bg-black border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none">
                    <option value="" disabled>Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Description (optional)</label>
                  <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)}
                    className="w-full bg-black border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none" 
                    placeholder="What was this for?" />
                </div>
                <div className="pt-4">
                  <BorderGlowBtn type="button" onClick={handleAddSubmit}>
                    Save Expense
                  </BorderGlowBtn>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Expenses;
