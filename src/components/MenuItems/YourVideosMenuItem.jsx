import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import './MenuItems.css'

const VideoIcon = () => <span className="material-icons">smart_display</span>

const YourVideosMenuItem = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { actions } = useApp()
  
  const isActive = location.pathname === '/your-videos'
  
  const handleClick = () => {
    // Navigate to your videos page
    navigate('/your-videos')
    // Set active category to 'Your Videos'
    actions.setActiveCategory('Your Videos')
    // Reset search query
    actions.setSearchQuery('')
    // Load user's videos
    actions.setLoading(true)
  }

  return (
    <div 
      className={`menu-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="menu-item-icon">
        <VideoIcon />
      </div>
      <span className="menu-item-label">Your videos</span>
    </div>
  )
}

export default YourVideosMenuItem
