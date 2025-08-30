import axios from 'axios'

// YouTube API configuration
const API_KEY = "AIzaSyAA13mNy3utl4-TX1TFVnSUhKH0K-FfRLY"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

// Create axios instance with default config
const youtube = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY
  }
})

// Popular videos for home page
export const getPopularVideos = async (maxResults = 50, pageToken = '') => {
  try {
    const response = await youtube.get('/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        regionCode: 'US',
        maxResults,
        pageToken
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching popular videos:', error)
    throw error
  }
}

// Search videos
export const searchVideos = async (query, maxResults = 25, pageToken = '') => {
  try {
    const response = await youtube.get('/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
        pageToken,
        order: 'relevance'
      }
    })
    
    // Get video statistics for search results
    const videoIds = response.data.items.map(item => item.id.videoId).join(',')
    const statsResponse = await youtube.get('/videos', {
      params: {
        part: 'statistics,contentDetails',
        id: videoIds
      }
    })
    
    // Combine search results with statistics
    const videosWithStats = response.data.items.map(video => {
      const stats = statsResponse.data.items.find(stat => stat.id === video.id.videoId)
      return {
        ...video,
        statistics: stats?.statistics || {},
        contentDetails: stats?.contentDetails || {}
      }
    })
    
    return {
      ...response.data,
      items: videosWithStats
    }
  } catch (error) {
    console.error('Error searching videos:', error)
    throw error
  }
}

// Get video details
export const getVideoDetails = async (videoId) => {
  try {
    const response = await youtube.get('/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId
      }
    })
    return response.data.items[0]
  } catch (error) {
    console.error('Error fetching video details:', error)
    throw error
  }
}

// Get channel details
export const getChannelDetails = async (channelId) => {
  try {
    const response = await youtube.get('/channels', {
      params: {
        part: 'snippet,statistics',
        id: channelId
      }
    })
    return response.data.items[0]
  } catch (error) {
    console.error('Error fetching channel details:', error)
    throw error
  }
}

// Get videos by category
export const getVideosByCategory = async (categoryId, maxResults = 25) => {
  try {
    const response = await youtube.get('/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        videoCategoryId: categoryId,
        regionCode: 'US',
        maxResults
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching videos by category:', error)
    throw error
  }
}

// Get related/suggested videos (using search with similar terms)
export const getRelatedVideos = async (videoTitle, channelTitle, maxResults = 20) => {
  try {
    // Extract keywords from video title for better related videos
    const keywords = videoTitle.split(' ').slice(0, 3).join(' ')
    const searchQuery = `${keywords} ${channelTitle}`
    
    const response = await searchVideos(searchQuery, maxResults)
    return response
  } catch (error) {
    console.error('Error fetching related videos:', error)
    throw error
  }
}

// Utility functions
export const formatDuration = (duration) => {
  if (!duration) return '0:00'
  
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return '0:00'
  
  const hours = parseInt(match[1]) || 0
  const minutes = parseInt(match[2]) || 0
  const seconds = parseInt(match[3]) || 0
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const formatViewCount = (count) => {
  if (!count) return '0 views'
  
  const num = parseInt(count)
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B views`
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`
  }
  return `${num} views`
}

export const formatSubscriberCount = (count) => {
  if (!count) return '0 subscribers'
  
  const num = parseInt(count)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M subscribers`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K subscribers`
  }
  return `${num} subscribers`
}

export const formatPublishedTime = (publishedAt) => {
  if (!publishedAt) return ''
  
  const now = new Date()
  const published = new Date(publishedAt)
  const diffInSeconds = Math.floor((now - published) / 1000)
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }
  
  return 'Just now'
}
