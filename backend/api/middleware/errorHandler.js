export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500
  const isProduction = process.env.NODE_ENV === 'production'

  console.error(`[ERROR] ${req.method} ${req.path} - ${status}:`, {
    message: err.message,
    stack: isProduction ? '🥞' : err.stack,
  })

  if (res.headersSent) {
    console.warn('[WARN] Headers already sent, passing to next error handler')
    return next(err)
  }

  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only send error details in development
    ...(isProduction ? {} : {
      error: err.message,
      stack: err.stack
    })
  })
}
