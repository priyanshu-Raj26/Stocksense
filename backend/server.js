require("dotenv").config();

const app = require("./app");

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  // quick sanity log for local dev
  console.log(`StockSense backend running on http://localhost:${port}`);
});
