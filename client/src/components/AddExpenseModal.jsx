import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, Tag, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import { CATEGORIES, CATEGORY_ICONS } from '../lib/categories';

export default function AddExpenseModal({ onClose, expense }) {
  const { addExpense, updateExpense } = useStore();
  const isEdit = !!expense;

  const [form, setForm] = useState({
    title: expense?.title || '',
    amount: expense?.amount || '',
    type: expense?.type || 'expense',
    category: expense?.category || 'Other',
    date: expense?.date ? expense.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    note: expense?.note || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return toast.error('Fill in required fields');
    setLoading(true);
    try {
      if (isEdit) {
        await updateExpense(expense._id, form);
        toast.success('Transaction updated');
      } else {
        await addExpense(form);
        toast.success('Transaction added');
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-sky-500/60 transition-all duration-200 text-sm';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="glass rounded-2xl p-6 w-full max-w-md neon-blue"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Type toggle */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-5">
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, type: t })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                form.type === t
                  ? t === 'expense'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="relative">
            <Tag size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`${inputClass} pl-10`}
              required
            />
          </div>

          {/* Amount */}
          <div className="relative">
            <DollarSign size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="number"
              placeholder="Amount *"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className={`${inputClass} pl-10`}
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Category */}
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={`${inputClass} cursor-pointer`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-900">
                {CATEGORY_ICONS[cat]} {cat}
              </option>
            ))}
          </select>

          {/* Date */}
          <div className="relative">
            <Calendar size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={`${inputClass} pl-10`}
            />
          </div>

          {/* Note */}
          <div className="relative">
            <FileText size={15} className="absolute left-4 top-3.5 text-white/30" />
            <textarea
              placeholder="Note (optional)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className={`${inputClass} pl-10 resize-none h-20`}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 ${
              form.type === 'expense'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-rose-500/25'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/25'
            } hover:shadow-lg`}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Transaction' : 'Add Transaction'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
