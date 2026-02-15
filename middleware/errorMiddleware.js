const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // In production, don't expose stack traces
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    error: true
  });
};

module.exports = errorHandler;
