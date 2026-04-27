async function getCompanies(_req, res) {
  res.status(501).json({
    error: true,
    message: "Companies endpoint is wired but not implemented yet.",
    code: 501,
  });
}

module.exports = {
  getCompanies,
};
