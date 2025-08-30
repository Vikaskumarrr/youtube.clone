import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import './MenuItems.css'

const LibraryIcon = () => <span className="material-icons">video_library</span>

const LibraryMenuItem = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { actions } = useApp()
  
  const isActive = location.pathname === '/library'
  
  const handleClick = () => {
    // Navigate to library page
    navigate('/library')
    // Set active category to 'Library'
    actions.setActiveCategory('Library')
    // Reset search query
    actions.setSearchQuery('')
    // Load library videos
    actions.setLoading(true)
  }

  return (
    <div 
      className={`menu-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="menu-item-icon">
        <LibraryIcon />
      </div>
      <span className="menu-item-label">Library</span>
    </div>
  )
}

export default LibraryMenuItem
