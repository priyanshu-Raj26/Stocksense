const { pool } = require("../config/db");

async function getSummary(req, res) {
  const symbol = req.params.symbol;

  const query = `
    SELECT
      symbol,
      week52_high,
      week52_low,
      avg_close,
      volatility_score
    FROM yearly_summary
    WHERE symbol = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(query, [symbol]);

  if (!rows.length) {
    const err = new Error("Couldn't find summary for this symbol.");
    err.statusCode = 404;
    throw err;
  }

  const summary = rows[0];
  res.json({
    symbol: summary.symbol,
    week52_high:
      summary.week52_high == null ? null : Number(summary.week52_high),
    week52_low: summary.week52_low == null ? null : Number(summary.week52_low),
    avg_close: summary.avg_close == null ? null : Number(summary.avg_close),
    volatility_score:
      summary.volatility_score == null
        ? null
        : Number(summary.volatility_score),
  });
}

module.exports = {
  getSummary,
};
