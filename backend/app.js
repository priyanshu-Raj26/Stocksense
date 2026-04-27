const express = require('express');
const cors = require('cors');

const companyRoutes = require('./routes/companyRoutes');
const stockRoutes = require('./routes/stockRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'stocksense-backend' });
});

app.use('/api/companies', companyRoutes);
app.use('/api', stockRoutes);
app.use('/api/summary', summaryRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
