import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBudget = createAsyncThunk('budget/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/budget', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch budget');
  }
});

export const saveBudget = createAsyncThunk('budget/save', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/budget', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to save budget');
  }
});

export const fetchBudgetHistory = createAsyncThunk('budget/history', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/budget/history');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
  }
});

const budgetSlice = createSlice({
  name: 'budget',
  initialState: { current: null, history: [], totalSpent: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.pending, (state) => { state.loading = true; })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.budget;
        state.totalSpent = action.payload.totalSpent;
      })
      .addCase(fetchBudget.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(saveBudget.fulfilled, (state, action) => { state.current = action.payload.budget; })
      .addCase(fetchBudgetHistory.fulfilled, (state, action) => { state.history = action.payload.budgets; });
  },
});

export default budgetSlice.reducer;
