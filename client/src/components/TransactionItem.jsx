import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../lib/categories';
import AddExpenseModal from './AddExpenseModal';

export default function TransactionItem({ expense }) {
  const { deleteExpense } = useStore();
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteExpense(expense._id);
      toast.success('Transaction deleted');
    } catch {
      toast.error('Failed to delete');
      setDeleting(false);
    }
  };

  const icon = CATEGORY_ICONS[expense.category] || '💰';
  const color = CATEGORY_COLORS[expense.category] || '#0ea5e9';
  const isIncome = expense.type === 'income';

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: deleting ? 0 : 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex items-center gap-4 p-4 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 hover:border-white/10 transition-all duration-200 group"
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{expense.title}</p>
          <p className="text-xs text-white/30 mt-0.5">
            {expense.category} · {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Amount */}
        <div className="text-right flex-shrink-0">
          <p className={`text-sm font-semibold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isIncome ? '+' : '-'}${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowEdit(true)}
            className="p-1.5 rounded-lg text-white/30 hover:text-sky-400 hover:bg-sky-500/10 transition-all"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </motion.div>

      {showEdit && (
        <AddExpenseModal expense={expense} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
}
