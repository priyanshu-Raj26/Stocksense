async function getSummary(_req, res) {
  res.status(501).json({
    error: true,
    message: "Summary endpoint is wired but not implemented yet.",
    code: 501,
  });
}

module.exports = {
  getSummary,
};
