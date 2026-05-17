import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('/transactions', { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const fetchSummary = createAsyncThunk(
  'transactions/fetchSummary',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('/transactions/summary', { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch summary');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/transactions', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/transactions/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/transactions/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: [],
    summary: null,
    categoryBreakdown: [],
    monthlyTrend: [],
    recentTransactions: [],
    total: 0,
    pages: 0,
    currentPage: 1,
    loading: false,
    error: null,
    filters: { type: '', category: '', startDate: '', endDate: '', search: '', sortBy: 'date', sortOrder: 'desc' },
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters: (state) => {
      state.filters = { type: '', category: '', startDate: '', endDate: '', search: '', sortBy: 'date', sortOrder: 'desc' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.transactions;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary = action.payload.summary;
        state.categoryBreakdown = action.payload.categoryBreakdown;
        state.monthlyTrend = action.payload.monthlyTrend;
        state.recentTransactions = action.payload.recentTransactions;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.list.unshift(action.payload.transaction);
        state.total += 1;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const idx = state.list.findIndex((t) => t._id === action.payload.transaction._id);
        if (idx !== -1) state.list[idx] = action.payload.transaction;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setFilters, clearFilters } = transactionSlice.actions;
export default transactionSlice.reducer;
