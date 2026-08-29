import multer from 'multer'

export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack || err)

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message })
  }

  const status = err.status || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  })
}
