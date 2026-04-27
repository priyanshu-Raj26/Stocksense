function notFound(req, _res, next) {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message =
    err.message || "Something broke on our side. Please try again in a moment.";

  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  res.status(statusCode).json({
    error: true,
    message,
    code: statusCode,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
