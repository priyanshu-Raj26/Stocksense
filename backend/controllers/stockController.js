const { pool } = require("../config/db");
const { pearsonCorrelation } = require("../utils/calculations");

const ALLOWED_RANGES = new Set([30, 90, 180]);

async function getStockData(req, res) {
  const symbol = req.params.symbol;
  const requestedRange = Number(req.query.range || 30);

  if (!ALLOWED_RANGES.has(requestedRange)) {
    const err = new Error("Range must be one of 30, 90, or 180.");
    err.statusCode = 400;
    throw err;
  }

  const query = `
    SELECT
      trade_date,
      open_price,
      close_price,
      high_price,
      low_price,
      volume,
      daily_return,
      moving_avg_7
    FROM stock_prices
    WHERE symbol = ?
    ORDER BY trade_date DESC
    LIMIT ?
  `;

  const [rows] = await pool.query(query, [symbol, requestedRange]);

  if (!rows.length) {
    const err = new Error("Couldn't find data for this symbol.");
    err.statusCode = 404;
    throw err;
  }

  const data = rows
    .slice()
    .reverse()
    .map((row) => ({
      date: row.trade_date,
      open: Number(row.open_price),
      close: Number(row.close_price),
      high: row.high_price == null ? null : Number(row.high_price),
      low: row.low_price == null ? null : Number(row.low_price),
      volume: row.volume == null ? null : Number(row.volume),
      daily_return: row.daily_return == null ? null : Number(row.daily_return),
      moving_avg_7: row.moving_avg_7 == null ? null : Number(row.moving_avg_7),
    }));

  res.json({
    symbol,
    data,
  });
}

function normalizeDate(value) {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
}

async function fetchRecentCloseSeries(symbol) {
  const query = `
    SELECT trade_date, close_price
    FROM stock_prices
    WHERE symbol = ?
    ORDER BY trade_date DESC
    LIMIT 30
  `;

  const [rows] = await pool.query(query, [symbol]);

  return rows
    .slice()
    .reverse()
    .map((row) => ({
      date: normalizeDate(row.trade_date),
      close: Number(row.close_price),
    }));
}

async function compareStocks(req, res) {
  const { symbol1, symbol2 } = req.query;

  if (!symbol1 || !symbol2) {
    const err = new Error("Both symbol1 and symbol2 are required.");
    err.statusCode = 400;
    throw err;
  }

  const [series1, series2] = await Promise.all([
    fetchRecentCloseSeries(symbol1),
    fetchRecentCloseSeries(symbol2),
  ]);

  if (!series1.length || !series2.length) {
    const err = new Error("Couldn't find data for one or both symbols.");
    err.statusCode = 404;
    throw err;
  }

  const symbol2ByDate = new Map(
    series2.map((point) => [point.date, point.close]),
  );
  const alignedSeries1 = [];
  const alignedSeries2 = [];

  for (const point of series1) {
    if (symbol2ByDate.has(point.date)) {
      alignedSeries1.push(point.close);
      alignedSeries2.push(symbol2ByDate.get(point.date));
    }
  }

  const correlation =
    alignedSeries1.length >= 2
      ? pearsonCorrelation(alignedSeries1, alignedSeries2)
      : null;

  res.json({
    symbol1,
    symbol2,
    correlation,
    data: {
      [symbol1]: series1,
      [symbol2]: series2,
    },
  });
}

async function getTopMovers(_req, res) {
  const latestDateQuery = `
    SELECT MAX(trade_date) AS latest_trade_date
    FROM stock_prices
  `;
  const [latestRows] = await pool.query(latestDateQuery);
  const latestTradeDate = latestRows[0]?.latest_trade_date;

  if (!latestTradeDate) {
    res.json({
      gainers: [],
      losers: [],
    });
    return;
  }

  const moversQuery = `
    SELECT symbol, daily_return
    FROM stock_prices
    WHERE trade_date = ? AND daily_return > 0
    ORDER BY daily_return DESC
    LIMIT 3
  `;

  const losersQuery = `
    SELECT symbol, daily_return
    FROM stock_prices
    WHERE trade_date = ? AND daily_return < 0
    ORDER BY daily_return ASC
    LIMIT 3
  `;

  const [gainerRows, loserRows] = await Promise.all([
    pool.query(moversQuery, [latestTradeDate]),
    pool.query(losersQuery, [latestTradeDate]),
  ]);

  const gainers = gainerRows[0].map((row) => ({
    symbol: row.symbol,
    daily_return: Number(row.daily_return),
  }));

  const losers = loserRows[0].map((row) => ({
    symbol: row.symbol,
    daily_return: Number(row.daily_return),
  }));

  res.json({
    gainers,
    losers,
  });
}

module.exports = {
  getStockData,
  compareStocks,
  getTopMovers,
};
