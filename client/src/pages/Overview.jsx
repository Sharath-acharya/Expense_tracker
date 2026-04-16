import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react';
import useStore from '../store/useStore';
import AddExpenseModal from '../components/AddExpenseModal';
import TransactionItem from '../components/TransactionItem';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Overview() {
  const { summary, expenses, loading } = useStore();
  const [showModal, setShowModal] = useState(false);

  const cards = [
    {
      label: 'Total Balance',
      value: summary.balance,
      icon: Wallet,
      gradient: 'from-sky-500 to-violet-600',
      glow: 'neon-blue',
      prefix: summary.balance >= 0 ? '+' : '',
    },
    {
      label: 'Total Income',
      value: summary.totalIncome,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      glow: 'neon-green',
      prefix: '+',
    },
    {
      label: 'Total Expenses',
      value: summary.totalExpense,
      icon: TrendingDown,
      gradient: 'from-rose-500 to-pink-600',
      glow: 'neon-red',
      prefix: '-',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="text-white/40 text-sm mt-0.5">Your financial snapshot</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 text-white text-sm font-medium shadow-lg hover:shadow-sky-500/25 transition-shadow"
        >
          <Plus size={16} />
          Add Transaction
        </motion.button>
      </div>

      {/* Summary cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        {cards.map((card) => (
          <motion.div
            key={card.label}
            variants={item}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`glass rounded-2xl p-6 ${card.glow} relative overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5`} />
            <div className="relative">
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} mb-4`}>
                <card.icon size={20} className="text-white" />
              </div>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-white">
                {card.prefix}${Math.abs(card.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent transactions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="shimmer h-16 rounded-xl" />
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12">
            <Wallet size={40} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No transactions yet</p>
            <p className="text-white/20 text-sm">Add your first transaction to get started</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {expenses.slice(0, 8).map((expense) => (
              <motion.div key={expense._id} variants={item}>
                <TransactionItem expense={expense} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {showModal && <AddExpenseModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
