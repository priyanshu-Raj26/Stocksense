async function getStockData(_req, res) {
  res.status(501).json({
    error: true,
    message: "Stock data endpoint is wired but not implemented yet.",
    code: 501,
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
