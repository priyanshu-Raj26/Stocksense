require("dotenv").config();

const axios = require("axios");

const { pool } = require("../config/db");
const {
  dailyReturn,
  movingAverage,
  volatilityScore,
} = require("../utils/calculations");

const TARGET_COMPANIES = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries", sector: "Energy" },
  {
    symbol: "TCS.NS",
    name: "Tata Consultancy Services",
    sector: "Information Technology",
  },
  { symbol: "INFY.NS", name: "Infosys", sector: "Information Technology" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", sector: "Financial Services" },
  { symbol: "WIPRO.NS", name: "Wipro", sector: "Information Technology" },
];

function formatTradeDate(unixSeconds) {
  return new Date(unixSeconds * 1000).toISOString().split("T")[0];
}

async function fetchHistoricalRows(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`;
  const { data } = await axios.get(url, {
    params: {
      range: "1y",
      interval: "1d",
    },
    timeout: 30000,
  });

  const result = data?.chart?.result?.[0];
  const quote = result?.indicators?.quote?.[0];
  const timestamps = result?.timestamp || [];

  if (!result || !quote || !timestamps.length) {
    return [];
  }

  const cleanedRows = [];
  const dedupeByDate = new Set();

  for (let i = 0; i < timestamps.length; i += 1) {
    const open = quote.open?.[i];
    const close = quote.close?.[i];
    const high = quote.high?.[i];
    const low = quote.low?.[i];
    const volume = quote.volume?.[i];

    if (open == null || close == null) {
      continue;
    }

    const tradeDate = formatTradeDate(timestamps[i]);
    const rowKey = `${symbol}:${tradeDate}`;

    if (dedupeByDate.has(rowKey)) {
      continue;
    }

    dedupeByDate.add(rowKey);
    cleanedRows.push({
      symbol,
      tradeDate,
      openPrice: Number(open),
      closePrice: Number(close),
      highPrice: high == null ? null : Number(high),
      lowPrice: low == null ? null : Number(low),
      volume: volume == null ? null : Number(volume),
    });
  }

  return cleanedRows;
}

async function ensureCompany(connection, company) {
  const query = `
    INSERT INTO companies (symbol, name, sector)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      sector = VALUES(sector)
  `;

  await connection.execute(query, [
    company.symbol,
    company.name,
    company.sector,
  ]);
}

async function insertStockRows(connection, rows) {
  const closeSeries = [];
  const enrichedRows = [];

  for (const row of rows) {
    closeSeries.push(row.closePrice);
    const computedReturn = dailyReturn(row.openPrice, row.closePrice);
    const computedMovingAvg = movingAverage(closeSeries, 7);

    enrichedRows.push({
      ...row,
      dailyReturn: computedReturn,
      movingAvg7: computedMovingAvg,
    });
  }

  const insertQuery = `
    INSERT INTO stock_prices (
      symbol,
      trade_date,
      open_price,
      close_price,
      high_price,
      low_price,
      volume,
      daily_return,
      moving_avg_7
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      open_price = VALUES(open_price),
      close_price = VALUES(close_price),
      high_price = VALUES(high_price),
      low_price = VALUES(low_price),
      volume = VALUES(volume),
      daily_return = VALUES(daily_return),
      moving_avg_7 = VALUES(moving_avg_7)
  `;

  for (const row of enrichedRows) {
    await connection.execute(insertQuery, [
      row.symbol,
      row.tradeDate,
      row.openPrice,
      row.closePrice,
      row.highPrice,
      row.lowPrice,
      row.volume,
      row.dailyReturn,
      row.movingAvg7,
    ]);
  }

  return enrichedRows;
}

async function upsertYearlySummary(connection, symbol, rows) {
  const closingPrices = rows.map((row) => row.closePrice);
  const dailyReturns = rows
    .map((row) => row.dailyReturn)
    .filter((value) => value != null);

  if (!closingPrices.length) {
    return;
  }

  const weekHigh = Number(Math.max(...closingPrices).toFixed(2));
  const weekLow = Number(Math.min(...closingPrices).toFixed(2));
  const avgClose = Number(
    (
      closingPrices.reduce((sum, price) => sum + price, 0) /
      closingPrices.length
    ).toFixed(2),
  );
  const volatility = dailyReturns.length ? volatilityScore(dailyReturns) : null;

  const summaryQuery = `
    INSERT INTO yearly_summary (
      symbol,
      week52_high,
      week52_low,
      avg_close,
      volatility_score
    )
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      week52_high = VALUES(week52_high),
      week52_low = VALUES(week52_low),
      avg_close = VALUES(avg_close),
      volatility_score = VALUES(volatility_score)
  `;

  await connection.execute(summaryQuery, [
    symbol,
    weekHigh,
    weekLow,
    avgClose,
    volatility,
  ]);
}

async function seedCompanyData(connection, company) {
  await ensureCompany(connection, company);

  const rows = await fetchHistoricalRows(company.symbol);
  if (!rows.length) {
    console.log(`No valid rows for ${company.symbol}, skipping.`);
    return;
  }

  const sortedRows = rows.sort((a, b) =>
    a.tradeDate.localeCompare(b.tradeDate),
  );

  const enrichedRows = await insertStockRows(connection, sortedRows);
  await upsertYearlySummary(connection, company.symbol, enrichedRows);

  console.log(`Seeded ${company.symbol} with ${enrichedRows.length} rows.`);
}

async function runSeed() {
  const connection = await pool.getConnection();

  try {
    for (const company of TARGET_COMPANIES) {
      await seedCompanyData(connection, company);
    }

    console.log("Seeding complete.");
  } finally {
    connection.release();
    await pool.end();
  }
}

runSeed().catch((err) => {
  console.error("Seed script failed:", err.message);
  process.exit(1);
});
