const SLOW_MS = 500;

function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    const slow = ms > SLOW_MS ? ' SLOW' : '';
    console.log(
      `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms${slow}`
    );
  });

  next();
}

module.exports = requestLogger;