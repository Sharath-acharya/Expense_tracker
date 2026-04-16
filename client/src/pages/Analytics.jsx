import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import api from '../lib/api';
import { CATEGORY_COLORS } from '../lib/categories';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: 'rgba(255,255,255,0.6)', font: { size: 12 } } },
    tooltip: {
      backgroundColor: 'rgba(17,17,24,0.95)',
      borderColor: 'rgba(14,165,233,0.3)',
      borderWidth: 1,
      titleColor: '#fff',
      bodyColor: 'rgba(255,255,255,0.7)',
      padding: 12,
      cornerRadius: 10,
    },
  },
  scales: {
    x: { ticks: { color: 'rgba(255,255,255,0.4)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    y: { ticks: { color: 'rgba(255,255,255,0.4)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
  },
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Analytics() {
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/expenses/stats/monthly'),
      api.get('/expenses/stats/categories'),
    ]).then(([m, c]) => {
      setMonthly(m.data);
      setCategories(c.data);
    }).finally(() => setLoading(false));
  }, []);

  // Build monthly bar data
  const monthlyMap = {};
  monthly.forEach(({ _id, total }) => {
    const key = `${MONTHS[_id.month - 1]} ${_id.year}`;
    if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
    monthlyMap[key][_id.type] = total;
  });
  const monthLabels = Object.keys(monthlyMap).slice(-6);
  const barData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Income',
        data: monthLabels.map((k) => monthlyMap[k]?.income || 0),
        backgroundColor: 'rgba(34,197,94,0.7)',
        borderColor: '#22c55e',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Expenses',
        data: monthLabels.map((k) => monthlyMap[k]?.expense || 0),
        backgroundColor: 'rgba(239,68,68,0.7)',
        borderColor: '#ef4444',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Net line data
  const lineData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Net Balance',
        data: monthLabels.map((k) => (monthlyMap[k]?.income || 0) - (monthlyMap[k]?.expense || 0)),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0ea5e9',
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  // Doughnut
  const doughnutData = {
    labels: categories.map((c) => c._id),
    datasets: [
      {
        data: categories.map((c) => c.total),
        backgroundColor: categories.map((c) => `${CATEGORY_COLORS[c._id] || '#94a3b8'}cc`),
        borderColor: categories.map((c) => CATEGORY_COLORS[c._id] || '#94a3b8'),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="shimmer h-72 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 pt-2">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-white/40 text-sm mt-0.5">Visual breakdown of your finances</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 lg:col-span-2"
        >
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Monthly Income vs Expenses</h3>
          <div className="h-64">
            <Bar data={barData} options={chartDefaults} />
          </div>
        </motion.div>

        {/* Net line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Net Balance Trend</h3>
          <div className="h-56">
            <Line data={lineData} options={{ ...chartDefaults }} />
          </div>
        </motion.div>

        {/* Doughnut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Spending by Category</h3>
          {categories.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-white/30 text-sm">No expense data yet</div>
          ) : (
            <div className="h-56">
              <Doughnut
                data={doughnutData}
                options={{
                  ...chartDefaults,
                  scales: undefined,
                  cutout: '65%',
                  plugins: {
                    ...chartDefaults.plugins,
                    legend: { position: 'right', labels: { color: 'rgba(255,255,255,0.6)', font: { size: 11 }, padding: 12 } },
                  },
                }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
