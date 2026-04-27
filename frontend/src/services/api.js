import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getCompanies = async () => {
  const { data } = await api.get("/companies");
  return data;
};

export const getStockData = async (symbol, range = 30) => {
  const { data } = await api.get(`/data/${symbol}`, {
    params: { range },
  });
  return data;
};

export const getSummary = async (symbol) => {
  const { data } = await api.get(`/summary/${symbol}`);
  return data;
};

export const getTopMovers = async () => {
  const { data } = await api.get("/top-movers");
  return data;
};

export const getCompareData = async (symbol1, symbol2) => {
  const { data } = await api.get("/compare", {
    params: { symbol1, symbol2 },
  });
  return data;
};

export default api;
