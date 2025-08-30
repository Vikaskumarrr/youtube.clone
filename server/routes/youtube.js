const express = require('express')
const axios = require('axios')
const router = express.Router()

// YouTube API configuration
const API_KEY = process.env.YOUTUBE_API_KEY || "AIzaSyAA13mNy3utl4-TX1TFVnSUhKH0K-FfRLY"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

// Create axios instance with default config
const youtube = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY
  }
})

// Error handler
const handleError = (res, error, message = 'An error occurred') => {
  console.error('API Error:', error.response?.data || error.message)
  res.status(error.response?.status || 500).json({
    error: message,
    details: error.response?.data?.error || error.message
  })
}

// Get popular videos
router.get('/videos/popular', async (req, res) => {
  try {
    const { maxResults = 50, pageToken = '', regionCode = 'US' } = req.query

    const response = await youtube.get('/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        regionCode,
        maxResults: parseInt(maxResults),
        pageToken
      }
    })

    res.json(response.data)
  } catch (error) {
    handleError(res, error, 'Failed to fetch popular videos')
  }
})

// Search videos
router.get('/search', async (req, res) => {
  try {
    const { 
      q: query, 
      maxResults = 25, 
      pageToken = '', 
      order = 'relevance',
      type = 'video',
      videoDuration,
      videoDefinition,
      videoCategoryId
    } = req.query

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' })
    }

    const searchParams = {
      part: 'snippet',
      q: query,
      type,
      maxResults: parseInt(maxResults),
      pageToken,
      order
    }

    // Add optional filters
    if (videoDuration) searchParams.videoDuration = videoDuration
    if (videoDefinition) searchParams.videoDefinition = videoDefinition
    if (videoCategoryId) searchParams.videoCategoryId = videoCategoryId

    const response = await youtube.get('/search', {
      params: searchParams
    })

    // Get video statistics for search results
    if (response.data.items && response.data.items.length > 0) {
      const videoIds = response.data.items
        .filter(item => item.id.videoId)
        .map(item => item.id.videoId)
        .join(',')

      if (videoIds) {
        const statsResponse = await youtube.get('/videos', {
          params: {
            part: 'statistics,contentDetails',
            id: videoIds
          }
        })

        // Combine search results with statistics
        const videosWithStats = response.data.items.map(video => {
          if (video.id.videoId) {
            const stats = statsResponse.data.items.find(stat => stat.id === video.id.videoId)
            return {
              ...video,
              statistics: stats?.statistics || {},
              contentDetails: stats?.contentDetails || {}
            }
          }
          return video
        })

        response.data.items = videosWithStats
      }
    }

    res.json(response.data)
  } catch (error) {
    handleError(res, error, 'Failed to search videos')
  }
})

// Get video details
router.get('/videos/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params

    const response = await youtube.get('/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId
      }
    })

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' })
    }

    res.json(response.data.items[0])
  } catch (error) {
    handleError(res, error, 'Failed to fetch video details')
  }
})

// Get channel details
router.get('/channels/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params

    const response = await youtube.get('/channels', {
      params: {
        part: 'snippet,statistics,brandingSettings',
        id: channelId
      }
    })

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ error: 'Channel not found' })
    }

    res.json(response.data.items[0])
  } catch (error) {
    handleError(res, error, 'Failed to fetch channel details')
  }
})

// Get videos by category
router.get('/videos/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params
    const { maxResults = 25, pageToken = '', regionCode = 'US' } = req.query

    const response = await youtube.get('/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        videoCategoryId: categoryId,
        regionCode,
        maxResults: parseInt(maxResults),
        pageToken
      }
    })

    res.json(response.data)
  } catch (error) {
    handleError(res, error, 'Failed to fetch videos by category')
  }
})

// Get video categories
router.get('/videoCategories', async (req, res) => {
  try {
    const { regionCode = 'US' } = req.query

    const response = await youtube.get('/videoCategories', {
      params: {
        part: 'snippet',
        regionCode
      }
    })

    res.json(response.data)
  } catch (error) {
    handleError(res, error, 'Failed to fetch video categories')
  }
})

// Get channel videos
router.get('/channels/:channelId/videos', async (req, res) => {
  try {
    const { channelId } = req.params
    const { maxResults = 25, pageToken = '', order = 'date' } = req.query

    const response = await youtube.get('/search', {
      params: {
        part: 'snippet',
        channelId,
        maxResults: parseInt(maxResults),
        pageToken,
        order,
        type: 'video'
      }
    })

    res.json(response.data)
  } catch (error) {
    handleError(res, error, 'Failed to fetch channel videos')
  }
})

// Get video comments
router.get('/videos/:videoId/comments', async (req, res) => {
  try {
    const { videoId } = req.params
    const { maxResults = 20, pageToken = '', order = 'relevance' } = req.query

    const response = await youtube.get('/commentThreads', {
      params: {
        part: 'snippet,replies',
        videoId,
        maxResults: parseInt(maxResults),
        pageToken,
        order
      }
    })

    res.json(response.data)
  } catch (error) {
    handleError(res, error, 'Failed to fetch video comments')
  }
})

// Get trending videos
router.get('/videos/trending', async (req, res) => {
  try {
    const { maxResults = 50, regionCode = 'US', categoryId } = req.query

    const params = {
      part: 'snippet,statistics,contentDetails',
      chart: 'mostPopular',
      regionCode,
      maxResults: parseInt(maxResults)
    }

    if (categoryId) {
      params.videoCategoryId = categoryId
    }

    const response = await youtube.get('/videos', { params })

    res.json(response.data)
  } catch (error) {
    handleError(res, error, 'Failed to fetch trending videos')
  }
})

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    apiKey: API_KEY ? 'configured' : 'missing'
  })
})

module.exports = router
