import React, { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import VideoCard from '../../components/VideoCard/VideoCard'
import { getPopularVideos } from '../../utils/youtube'
import './Home.css'

const Home = () => {
  const { state, actions } = useApp()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [nextPageToken, setNextPageToken] = useState('')
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const categories = [
    'All', 'Music', 'Gaming', 'Movies', 'News', 'Sports', 'Technology',
    'Comedy', 'Education', 'Travel', 'Food', 'Fashion', 'Beauty'
  ]

  useEffect(() => {
    loadPopularVideos()
  }, [])

  const loadPopularVideos = async (pageToken = '') => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getPopularVideos(24, pageToken)
      
      if (pageToken) {
        // Load more videos (append to existing)
        setVideos(prev => [...prev, ...data.items])
      } else {
        // Initial load or refresh - randomize videos
        const randomizedVideos = shuffleArray(data.items)
        setVideos(randomizedVideos)
        actions.setVideos(randomizedVideos)
        setLastRefreshed(new Date())
      }
      
      setNextPageToken(data.nextPageToken || '')
    } catch (err) {
      console.error('Error loading videos:', err)
      setError('Failed to load videos. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const handleCategoryClick = async (category) => {
    actions.setActiveCategory(category)
    setLoading(true)
    
    try {
      if (category === 'All') {
        // Load all popular videos with randomization
        await loadPopularVideos()
      } else {
        // Search for videos by category using YouTube API
        const searchResults = await searchVideosByCategory(category)
        if (searchResults.length > 0) {
          setVideos(searchResults)
          actions.setVideos(searchResults)
        } else {
          // Fallback to local filtering if no search results
          const filteredVideos = filterVideosByCategory(category)
          setVideos(filteredVideos)
          actions.setVideos(filteredVideos)
        }
      }
    } catch (err) {
      console.error('Error searching videos by category:', err)
      // Fallback to local filtering
      const filteredVideos = filterVideosByCategory(category)
      setVideos(filteredVideos)
      actions.setVideos(filteredVideos)
    } finally {
      setLoading(false)
    }
  }

  // Function to search videos by category using YouTube API
  const searchVideosByCategory = async (category) => {
    try {
      const categoryKeywords = getCategoryKeywords(category)
      const searchQuery = categoryKeywords[0] // Use first keyword for search
      
      // Import search function dynamically to avoid circular imports
      const { searchVideos } = await import('../../utils/youtube')
      const searchResults = await searchVideos(searchQuery, 24)
      
      return searchResults.items || []
    } catch (err) {
      console.error('Error searching videos:', err)
      return []
    }
  }

  // Function to filter videos locally by category
  const filterVideosByCategory = (category) => {
    return videos.filter(video => {
      const videoTitle = video.snippet?.title?.toLowerCase() || ''
      const videoDesc = video.snippet?.description?.toLowerCase() || ''
      const videoTags = video.snippet?.tags || []
      
      // Get relevant keywords for the category
      const categoryKeywords = getCategoryKeywords(category)
      
      // Check if any keyword matches in title, description, or tags
      const titleMatch = categoryKeywords.some(keyword => 
        videoTitle.includes(keyword)
      )
      
      const descMatch = categoryKeywords.some(keyword => 
        videoDesc.includes(keyword)
      )
      
      const tagMatch = videoTags.some(tag => 
        categoryKeywords.some(keyword => 
          tag.toLowerCase().includes(keyword)
        )
      )
      
      return titleMatch || descMatch || tagMatch
    })
  }

  // Helper function to get relevant keywords for each category
  const getCategoryKeywords = (category) => {
    const categoryMap = {
      'Music': ['music', 'song', 'audio', 'concert', 'album', 'artist', 'band'],
      'Gaming': ['game', 'gaming', 'playthrough', 'stream', 'esports', 'gamer'],
      'Movies': ['movie', 'film', 'cinema', 'trailer', 'review', 'actor', 'actress'],
      'News': ['news', 'update', 'breaking', 'report', 'current', 'events'],
      'Sports': ['sport', 'football', 'basketball', 'tennis', 'match', 'game', 'team'],
      'Technology': ['tech', 'technology', 'software', 'hardware', 'programming', 'coding'],
      'Comedy': ['comedy', 'funny', 'humor', 'joke', 'laugh', 'entertainment'],
      'Education': ['education', 'learn', 'tutorial', 'course', 'study', 'knowledge'],
      'Travel': ['travel', 'trip', 'vacation', 'destination', 'tour', 'adventure'],
      'Food': ['food', 'cooking', 'recipe', 'kitchen', 'chef', 'restaurant'],
      'Fashion': ['fashion', 'style', 'clothing', 'outfit', 'trend', 'beauty'],
      'Beauty': ['beauty', 'makeup', 'skincare', 'cosmetics', 'tutorial', 'tips']
    }
    
    return categoryMap[category] || [category.toLowerCase()]
  }

  const handleLoadMore = () => {
    if (nextPageToken && !loading) {
      loadPopularVideos(nextPageToken)
    }
  }

  const LoadingGrid = () => (
    <div className="videos-grid">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="video-skeleton">
          <div className="skeleton-thumbnail"></div>
          <div className="skeleton-content">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-text">
              <div className="skeleton-title"></div>
              <div className="skeleton-metadata"></div>
              <div className="skeleton-metadata short"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  if (error) {
    return (
      <div className="home">
        <div className="error-container">
          <div className="error-content">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => loadPopularVideos()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home">
      {/* Category filters */}
      <div className="categories-container">
        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-chip ${
                state.activeCategory === category ? 'active' : ''
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Active category info and refresh button */}
        <div className="category-controls">
          {state.activeCategory !== 'All' && (
            <div className="active-category-info">
              <span className="active-category-label">
                Active: {state.activeCategory}
              </span>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => handleCategoryClick('All')}
              >
                Show All
              </button>
            </div>
          )}
          
          {/* Refresh button for random videos */}
          <button 
            className="btn btn-primary btn-sm refresh-btn"
            onClick={() => loadPopularVideos()}
            title="Get new random videos"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Category indicator */}
      {state.activeCategory !== 'All' ? (
        <div className="category-indicator">
          <h2>Category: {state.activeCategory}</h2>
          <p>Showing {videos.length} videos for {state.activeCategory}</p>
          <button 
            className="btn btn-secondary"
            onClick={() => handleCategoryClick('All')}
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="welcome-indicator">
          <h2>🎬 Welcome to YouTube Clone</h2>
          <p>Discover {videos.length} trending videos • Refresh for new content</p>
          {lastRefreshed && (
            <div className="last-refreshed">
              Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Videos grid */}
      <div className="home-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-message">
              {state.activeCategory !== 'All' ? 
                `Searching for ${state.activeCategory} videos...` : 
                'Loading videos...'
              }
            </div>
            <LoadingGrid />
          </div>
        ) : (
          <>
            {videos.length === 0 ? (
              <div className="no-videos-container">
                <div className="no-videos-content">
                  <div className="no-videos-icon">📺</div>
                  <h3>No videos found</h3>
                  <p>No videos available for the "{state.activeCategory}" category.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleCategoryClick('All')}
                  >
                    Show All Videos
                  </button>
                </div>
              </div>
            ) : (
              <div className="videos-grid">
                {videos.map((video, index) => (
                  <VideoCard
                    key={`${video.id}-${index}`}
                    video={video}
                    layout="grid"
                  />
                ))}
              </div>
            )}
            
            {/* Load more button - only show when not filtering by category */}
            {nextPageToken && state.activeCategory === 'All' && (
              <div className="load-more-container">
                <button
                  className={`btn load-more-btn ${loading ? 'loading' : ''}`}
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading"></div>
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
