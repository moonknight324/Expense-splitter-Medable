import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExchangeRateResponse } from '../types';

interface CurrencyState {
  rates: { [key: string]: number };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CurrencyState = {
  rates: {},
  status: 'idle',
  error: null,
};

const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

export const fetchExchangeRates = createAsyncThunk(
  'currency/fetchExchangeRates',
  async () => {
    const response = await fetch(`${BASE_URL}/latest/USD`);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    const data: ExchangeRateResponse = await response.json();
    return data.conversion_rates;
  }
);

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action: PayloadAction<{ [key: string]: number }>) => {
        state.status = 'succeeded';
        state.rates = action.payload;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch rates';
      });
  },
});

export default currencySlice.reducer;
