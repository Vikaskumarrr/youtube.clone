const express = require('express')
const path = require('path')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from the dist directory (for production)
app.use(express.static(path.join(__dirname, '../dist')))

// Serve materials directory
app.use('/materials', express.static(path.join(__dirname, '../materials')))

// API Routes
app.use('/api', require('./routes/youtube'))

// Handle React Router routes (SPA)
app.get('*', (req, res) => {
  // In development, let Vite handle this
  if (process.env.NODE_ENV === 'development') {
    res.status(404).send('Development server - use Vite')
  } else {
    // In production, serve the built React app
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`)
})
