import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import './MenuItems.css'

const ThumbUpIcon = () => <span className="material-icons">thumb_up</span>

const LikedVideosMenuItem = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { actions } = useApp()
  
  const isActive = location.pathname === '/liked-videos'
  
  const handleClick = () => {
    // Navigate to liked videos page
    navigate('/liked-videos')
    // Set active category to 'Liked Videos'
    actions.setActiveCategory('Liked Videos')
    // Reset search query
    actions.setSearchQuery('')
    // Load liked videos
    actions.setLoading(true)
  }

  return (
    <div 
      className={`menu-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="menu-item-icon">
        <ThumbUpIcon />
      </div>
      <span className="menu-item-label">Liked videos</span>
    </div>
  )
}

export default LikedVideosMenuItem
