import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, X } from 'lucide-react';
import useStore from '../store/useStore';
import TransactionItem from '../components/TransactionItem';
import AddExpenseModal from '../components/AddExpenseModal';
import { CATEGORIES } from '../lib/categories';

export default function Transactions() {
  const { expenses, fetchExpenses, loading } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchExpenses({ type: filterType || undefined, category: filterCategory || undefined });
  }, [filterType, filterCategory]);

  const filtered = expenses.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-white/40 text-sm mt-0.5">{filtered.length} records</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 text-white text-sm font-medium shadow-lg"
        >
          <Plus size={16} />
          Add
        </motion.button>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-sky-500/50 transition-all"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-sky-500/50 transition-all cursor-pointer"
        >
          <option value="" className="bg-gray-900">All Types</option>
          <option value="income" className="bg-gray-900">Income</option>
          <option value="expense" className="bg-gray-900">Expense</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-sky-500/50 transition-all cursor-pointer"
        >
          <option value="" className="bg-gray-900">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-gray-900">{c}</option>
          ))}
        </select>

        {(filterType || filterCategory || search) && (
          <button
            onClick={() => { setFilterType(''); setFilterCategory(''); setSearch(''); }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* List */}
      <div className="glass rounded-2xl p-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="shimmer h-16 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Filter size={40} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((expense, i) => (
              <motion.div
                key={expense._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <TransactionItem expense={expense} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AddExpenseModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
