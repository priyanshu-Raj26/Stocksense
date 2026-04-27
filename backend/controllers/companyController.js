const { pool } = require("../config/db");

async function getCompanies(_req, res) {
  const query = `
    SELECT symbol, name, sector
    FROM companies
    ORDER BY symbol ASC
  `;

  const [companies] = await pool.execute(query);
  res.json(companies);
}

module.exports = {
  getCompanies,
};
