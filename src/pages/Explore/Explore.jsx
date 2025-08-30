import React, { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import VideoCard from '../../components/VideoCard/VideoCard'
import { getPopularVideos } from '../../utils/youtube'
import './Explore.css'

const Explore = () => {
  const { state, actions } = useApp()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = [
    'Trending', 'Music', 'Gaming', 'Movies', 'News', 'Sports', 'Technology',
    'Comedy', 'Education', 'Travel', 'Food', 'Fashion', 'Beauty'
  ]

  useEffect(() => {
    loadTrendingVideos()
  }, [])

  const loadTrendingVideos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getPopularVideos(24)
      setVideos(data.items)
      actions.setVideos(data.items)
    } catch (err) {
      console.error('Error loading trending videos:', err)
      setError('Failed to load trending videos. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (category) => {
    actions.setActiveCategory(category)
    // In a real implementation, you would filter videos by category
    console.log('Selected category:', category)
  }

  if (loading) {
    return (
      <div className="explore-page">
        <div className="explore-header">
          <h1>Explore</h1>
          <p>Discover trending content and new videos</p>
        </div>
        <div className="loading-container">
          <div className="loading">Loading trending videos...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="explore-page">
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadTrendingVideos}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h1>Explore</h1>
        <p>Discover trending content and new videos</p>
      </div>

      <div className="categories-section">
        <h2>Categories</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-card ${
                state.activeCategory === category ? 'active' : ''
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="trending-section">
        <h2>Trending Now</h2>
        <div className="videos-grid">
          {videos.map((video, index) => (
            <VideoCard
              key={`${video.id}-${index}`}
              video={video}
              layout="grid"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Explore
