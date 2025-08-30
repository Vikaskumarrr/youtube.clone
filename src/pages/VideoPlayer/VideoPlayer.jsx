import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import VideoCard from '../../components/VideoCard/VideoCard'
import { getVideoDetails, getChannelDetails, getRelatedVideos } from '../../utils/youtube'
import { formatViewCount, formatPublishedTime, formatSubscriberCount } from '../../utils/youtube'
import './VideoPlayer.css'

const ThumbUpIcon = () => <span className="material-icons">thumb_up</span>
const ThumbDownIcon = () => <span className="material-icons">thumb_down</span>
const ShareIcon = () => <span className="material-icons">share</span>
const DownloadIcon = () => <span className="material-icons">download</span>
const MoreHorizIcon = () => <span className="material-icons">more_horiz</span>
const ExpandMoreIcon = () => <span className="material-icons">expand_more</span>

const VideoPlayer = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { state, actions } = useApp()
  
  const [video, setVideo] = useState(null)
  const [channel, setChannel] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  // Get video ID from URL
  const urlParams = new URLSearchParams(location.search)
  const videoId = urlParams.get('v')

  useEffect(() => {
    if (videoId) {
      loadVideoData(videoId)
    } else {
      navigate('/')
    }
  }, [videoId, navigate])

  const loadVideoData = async (id) => {
    try {
      setLoading(true)
      setError(null)

      // Load video details
      const videoData = await getVideoDetails(id)
      if (!videoData) {
        throw new Error('Video not found')
      }
      
      setVideo(videoData)
      actions.setSelectedVideo(videoData)

      // Load channel details
      if (videoData.snippet.channelId) {
        const channelData = await getChannelDetails(videoData.snippet.channelId)
        setChannel(channelData)
      }

      // Load related videos
      if (videoData.snippet.title && videoData.snippet.channelTitle) {
        const relatedData = await getRelatedVideos(
          videoData.snippet.title,
          videoData.snippet.channelTitle
        )
        setRelatedVideos(relatedData.items || [])
        actions.setRelatedVideos(relatedData.items || [])
      }

    } catch (err) {
      console.error('Error loading video data:', err)
      setError('Failed to load video. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = () => {
    setSubscribed(!subscribed)
  }

  const handleLike = () => {
    if (disliked) setDisliked(false)
    setLiked(!liked)
  }

  const handleDislike = () => {
    if (liked) setLiked(false)
    setDisliked(!disliked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video?.snippet?.title,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  const truncateDescription = (text, maxLength = 200) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="video-player-page">
        <div className="video-player-container">
          <div className="video-skeleton">
            <div className="skeleton-player"></div>
            <div className="skeleton-video-info">
              <div className="skeleton-title"></div>
              <div className="skeleton-metadata"></div>
              <div className="skeleton-channel"></div>
            </div>
          </div>
          <div className="related-videos-skeleton">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="related-skeleton">
                <div className="skeleton-thumbnail"></div>
                <div className="skeleton-info">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-metadata"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="video-player-page">
        <div className="error-container">
          <div className="error-content">
            <h2>Video unavailable</h2>
            <p>{error || 'This video is not available.'}</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="video-player-page">
      <div className="video-player-container">
        {/* Video Player */}
        <div className="video-player-section">
          <div className="video-player">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={video.snippet.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Video Info */}
          <div className="video-info-section">
            <h1 className="video-title">{video.snippet.title}</h1>
            
            <div className="video-actions">
              <div className="video-metadata">
                <span className="view-count">
                  {formatViewCount(video.statistics.viewCount)}
                </span>
                <span className="publish-date">
                  {formatPublishedTime(video.snippet.publishedAt)}
                </span>
              </div>
              
              <div className="action-buttons">
                <button 
                  className={`action-btn ${liked ? 'active' : ''}`}
                  onClick={handleLike}
                >
                  <ThumbUpIcon />
                  <span>{video.statistics.likeCount ? formatViewCount(video.statistics.likeCount) : 'Like'}</span>
                </button>
                
                <button 
                  className={`action-btn ${disliked ? 'active' : ''}`}
                  onClick={handleDislike}
                >
                  <ThumbDownIcon />
                  <span>Dislike</span>
                </button>
                
                <button className="action-btn" onClick={handleShare}>
                  <ShareIcon />
                  <span>Share</span>
                </button>
                
                <button className="action-btn">
                  <DownloadIcon />
                  <span>Download</span>
                </button>
                
                <button className="action-btn more-btn">
                  <MoreHorizIcon />
                </button>
              </div>
            </div>

            {/* Channel Info */}
            <div className="channel-section">
              <div className="channel-info">
                <img
                  src={channel?.snippet?.thumbnails?.default?.url || '/materials/Profile-pic.png'}
                  alt={video.snippet.channelTitle}
                  className="channel-avatar"
                />
                <div className="channel-details">
                  <h3 className="channel-name">{video.snippet.channelTitle}</h3>
                  <p className="subscriber-count">
                    {channel?.statistics?.subscriberCount 
                      ? formatSubscriberCount(channel.statistics.subscriberCount)
                      : 'No subscriber info'
                    }
                  </p>
                </div>
                <button 
                  className={`subscribe-btn ${subscribed ? 'subscribed' : ''}`}
                  onClick={handleSubscribe}
                >
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>

              {/* Description */}
              <div className="description-section">
                <div className="description-content">
                  <p className="description-text">
                    {showFullDescription 
                      ? video.snippet.description 
                      : truncateDescription(video.snippet.description)
                    }
                  </p>
                  {video.snippet.description && video.snippet.description.length > 200 && (
                    <button 
                      className="show-more-btn"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                      {showFullDescription ? 'Show less' : 'Show more'}
                      <ExpandMoreIcon />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Videos */}
        <div className="related-videos-section">
          <h3 className="related-videos-title">Up next</h3>
          <div className="related-videos-list">
            {relatedVideos.map((relatedVideo, index) => (
              <VideoCard
                key={`${relatedVideo.id?.videoId || relatedVideo.id}-${index}`}
                video={relatedVideo}
                layout="list"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
