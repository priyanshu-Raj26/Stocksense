import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCompanies,
  getStockData,
  getSummary,
  getTopMovers,
  getCompareData,
} from "../../services/api";

export const fetchCompanies = createAsyncThunk(
  "stock/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      return await getCompanies();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchStockData = createAsyncThunk(
  "stock/fetchStockData",
  async ({ symbol, range }, { rejectWithValue }) => {
    try {
      return await getStockData(symbol, range);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchSummary = createAsyncThunk(
  "stock/fetchSummary",
  async (symbol, { rejectWithValue }) => {
    try {
      return await getSummary(symbol);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchTopMovers = createAsyncThunk(
  "stock/fetchTopMovers",
  async (_, { rejectWithValue }) => {
    try {
      return await getTopMovers();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchCompareData = createAsyncThunk(
  "stock/fetchCompareData",
  async ({ symbol1, symbol2 }, { rejectWithValue }) => {
    try {
      return await getCompareData(symbol1, symbol2);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const initialState = {
  companies: [],
  selectedSymbol: null,
  stockData: [],
  summary: {},
  topMovers: { gainers: [], losers: [] },
  compareData: {},
  range: 30,
  loading: false,
  error: null,
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setSelectedSymbol(state, action) {
      state.selectedSymbol = action.payload;
    },
    setRange(state, action) {
      state.range = action.payload;
    },
    clearStockError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Couldn't load companies.";
      })
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSymbol = action.payload.symbol;
        state.stockData = action.payload.data || [];
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Couldn't load stock data.";
      })
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload || {};
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Couldn't load summary.";
      })
      .addCase(fetchTopMovers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopMovers.fulfilled, (state, action) => {
        state.loading = false;
        state.topMovers = action.payload || { gainers: [], losers: [] };
      })
      .addCase(fetchTopMovers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Couldn't load top movers.";
      })
      .addCase(fetchCompareData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompareData.fulfilled, (state, action) => {
        state.loading = false;
        state.compareData = action.payload || {};
      })
      .addCase(fetchCompareData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Couldn't load compare data.";
      });
  },
});

export const { setSelectedSymbol, setRange, clearStockError } =
  stockSlice.actions;

export default stockSlice.reducer;
