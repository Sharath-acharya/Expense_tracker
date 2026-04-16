import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expenses: [],
      summary: { totalIncome: 0, totalExpense: 0, balance: 0 },
      loading: false,

      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        set({ user: data.user, token: data.token });
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      },

      register: async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        set({ user: data.user, token: data.token });
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      },

      logout: () => {
        set({ user: null, token: null, expenses: [], summary: { totalIncome: 0, totalExpense: 0, balance: 0 } });
        delete api.defaults.headers.common['Authorization'];
      },

      fetchExpenses: async (filters = {}) => {
        set({ loading: true });
        try {
          const { data } = await api.get('/expenses', { params: filters });
          set({ expenses: data.expenses, summary: data.summary, loading: false });
        } catch {
          set({ loading: false });
        }
      },

      addExpense: async (payload) => {
        const { data } = await api.post('/expenses', payload);
        await get().fetchExpenses();
        return data;
      },

      updateExpense: async (id, payload) => {
        await api.put(`/expenses/${id}`, payload);
        await get().fetchExpenses();
      },

      deleteExpense: async (id) => {
        await api.delete(`/expenses/${id}`);
        await get().fetchExpenses();
      },

      initAuth: () => {
        const token = get().token;
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },
    }),
    {
      name: 'expense-tracker-store',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useStore;
