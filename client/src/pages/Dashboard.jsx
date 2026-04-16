import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Overview from './Overview';
import Transactions from './Transactions';
import Analytics from './Analytics';
import useStore from '../store/useStore';

export default function Dashboard() {
  const { fetchExpenses, initAuth } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initAuth();
    fetchExpenses();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
