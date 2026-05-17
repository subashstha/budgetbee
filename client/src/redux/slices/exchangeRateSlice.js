import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRates = createAsyncThunk('rates/fetch', async (baseCurrency = 'NPR') => {
  const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
  const data = await res.json();
  if (data.result !== 'success') throw new Error('Rate fetch failed');
  return { base: baseCurrency, rates: data.rates };
});

const exchangeRateSlice = createSlice({
  name: 'rates',
  initialState: { rates: {}, base: 'NPR', loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRates.pending,   (state) => { state.loading = true; })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates   = action.payload.rates;
        state.base    = action.payload.base;
      })
      .addCase(fetchRates.rejected,  (state) => { state.loading = false; });
  },
});

export default exchangeRateSlice.reducer;
