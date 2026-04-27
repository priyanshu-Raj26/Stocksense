const express = require("express");
const {
  getStockData,
  compareStocks,
  getTopMovers,
} = require("../controllers/stockController");

const router = express.Router();

router.get("/data/:symbol", getStockData);
router.get("/compare", compareStocks);
router.get("/top-movers", getTopMovers);

module.exports = router;
