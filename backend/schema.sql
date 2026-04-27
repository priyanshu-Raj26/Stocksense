CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  sector VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL,
  trade_date DATE NOT NULL,
  open_price DECIMAL(10, 2),
  close_price DECIMAL(10, 2),
  high_price DECIMAL(10, 2),
  low_price DECIMAL(10, 2),
  volume BIGINT,
  daily_return DECIMAL(8, 4),
  moving_avg_7 DECIMAL(10, 2),
  UNIQUE KEY unique_symbol_date (symbol, trade_date),
  FOREIGN KEY (symbol) REFERENCES companies(symbol)
);

CREATE TABLE yearly_summary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL UNIQUE,
  week52_high DECIMAL(10, 2),
  week52_low DECIMAL(10, 2),
  avg_close DECIMAL(10, 2),
  volatility_score DECIMAL(8, 4),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (symbol) REFERENCES companies(symbol)
);