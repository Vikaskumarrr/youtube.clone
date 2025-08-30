import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import './MenuItems.css'

const WatchLaterIcon = () => <span className="material-icons">watch_later</span>

const WatchLaterMenuItem = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { actions } = useApp()
  
  const isActive = location.pathname === '/watch-later'
  
  const handleClick = () => {
    // Navigate to watch later page
    navigate('/watch-later')
    // Set active category to 'Watch Later'
    actions.setActiveCategory('Watch Later')
    // Reset search query
    actions.setSearchQuery('')
    // Load watch later videos
    actions.setLoading(true)
  }

  return (
    <div 
      className={`menu-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="menu-item-icon">
        <WatchLaterIcon />
      </div>
      <span className="menu-item-label">Watch later</span>
    </div>
  )
}

export default WatchLaterMenuItem
