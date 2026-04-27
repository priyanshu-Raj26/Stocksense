const { pool } = require("../config/db");

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

async function compareStocks(_req, res) {
  res.status(501).json({
    error: true,
    message: "Compare endpoint is wired but not implemented yet.",
    code: 501,
  });
}

async function getTopMovers(_req, res) {
  res.status(501).json({
    error: true,
    message: "Top movers endpoint is wired but not implemented yet.",
    code: 501,
  });
}

module.exports = {
  getStockData,
  compareStocks,
  getTopMovers,
};
