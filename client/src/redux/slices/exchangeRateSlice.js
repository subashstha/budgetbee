import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRates = createAsyncThunk('rates/fetch', async (baseCurrency = 'NPR') => {
  const res = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}`);
  const data = await res.json();
  return { base: baseCurrency, rates: { ...data.rates, [baseCurrency]: 1 } };
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
