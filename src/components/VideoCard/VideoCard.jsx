import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDuration, formatViewCount, formatPublishedTime } from '../../utils/youtube'
import './VideoCard.css'

const MoreVertIcon = () => (
  <span className="material-icons">more_vert</span>
)

const VideoCard = ({ video, layout = 'grid' }) => {
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Handle different video ID formats
  const videoId = video.id?.videoId || video.id
  
  if (!videoId) {
    return null
  }

  const handleVideoClick = () => {
    navigate(`/watch?v=${videoId}`)
  }

  const handleChannelClick = (e) => {
    e.stopPropagation()
    // Navigate to channel page (implement later)
    console.log('Navigate to channel:', video.snippet.channelId)
  }

  const handleMoreClick = (e) => {
    e.stopPropagation()
    // Show more options menu (implement later)
    console.log('Show more options for video:', videoId)
  }

  // Get thumbnail URL with fallback
  const getThumbnailUrl = () => {
    const thumbnails = video.snippet?.thumbnails
    if (!thumbnails) return '/materials/YouTube-icon.png'
    
    return thumbnails.maxres?.url || 
           thumbnails.high?.url || 
           thumbnails.medium?.url || 
           thumbnails.default?.url ||
           '/materials/YouTube-icon.png'
  }

  const getChannelThumbnail = () => {
    // Try to get channel thumbnail from video data first
    if (video.snippet?.channelThumbnail) {
      return video.snippet.channelThumbnail
    }
    
    // Generate a colored avatar based on channel name for better visibility
    const channelName = video.snippet?.channelTitle || 'Unknown'
    const initials = channelName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
    
    // Create a data URL for a colored avatar with initials
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
    const color = colors[channelName.length % colors.length]
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" fill="${color}" rx="18"/>
        <text x="18" y="18" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
              text-anchor="middle" dy=".3em" fill="white">${initials}</text>
      </svg>
    `)}`
  }

  // Format video data
  const title = video.snippet?.title || 'Untitled Video'
  const channelName = video.snippet?.channelTitle || 'Unknown Channel'
  const publishedAt = video.snippet?.publishedAt
  const viewCount = video.statistics?.viewCount
  const duration = video.contentDetails?.duration
  
  if (layout === 'list') {
    return (
      <div className="video-card video-card-list" onClick={handleVideoClick}>
        <div className="video-thumbnail-container">
          <img
            src={getThumbnailUrl()}
            alt={title}
            className={`video-thumbnail ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {duration && (
            <span className="video-duration">{formatDuration(duration)}</span>
          )}
        </div>
        
        <div className="video-info">
          <h3 className="video-title">{title}</h3>
          <div className="video-metadata">
            <span className="channel-name" onClick={handleChannelClick}>
              {channelName}
            </span>
            <div className="video-stats">
              {viewCount && <span>{formatViewCount(viewCount)}</span>}
              {publishedAt && <span>{formatPublishedTime(publishedAt)}</span>}
            </div>
          </div>
        </div>
        
        <button className="more-options-btn" onClick={handleMoreClick}>
          <MoreVertIcon />
        </button>
      </div>
    )
  }

  // Grid layout (default)
  return (
    <div className="video-card video-card-grid" onClick={handleVideoClick}>
      <div className="video-thumbnail-container">
        <img
          src={getThumbnailUrl()}
          alt={title}
          className={`video-thumbnail ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        {duration && (
          <span className="video-duration">{formatDuration(duration)}</span>
        )}
        {!imageLoaded && !imageError && (
          <div className="thumbnail-skeleton"></div>
        )}
      </div>
      
      <div className="video-info">
        <div className="channel-avatar-container">
          <img
            src={getChannelThumbnail()}
            alt={channelName}
            className="channel-avatar"
            onClick={handleChannelClick}
            onError={(e) => {
              // Fallback to generated avatar if image fails to load
              e.target.style.display = 'none'
              const fallbackAvatar = document.createElement('div')
              fallbackAvatar.className = 'channel-avatar-fallback'
              fallbackAvatar.textContent = channelName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
              fallbackAvatar.style.backgroundColor = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'][channelName.length % 8]
              e.target.parentNode.appendChild(fallbackAvatar)
            }}
          />
        </div>
        
        <div className="video-details">
          <h3 className="video-title" title={title}>
            {title}
          </h3>
          <div className="video-metadata">
            <p className="channel-name" onClick={handleChannelClick}>
              {channelName}
            </p>
            <div className="video-stats">
              {viewCount && <span>{formatViewCount(viewCount)}</span>}
              {publishedAt && viewCount && <span className="separator">•</span>}
              {publishedAt && <span>{formatPublishedTime(publishedAt)}</span>}
            </div>
          </div>
        </div>
        
        <button className="more-options-btn" onClick={handleMoreClick}>
          <MoreVertIcon />
        </button>
      </div>
    </div>
  )
}

export default VideoCard
