import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import './MenuItems.css'

const ExploreIcon = () => <span className="material-icons">explore</span>

const ExploreMenuItem = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { actions } = useApp()
  
  const isActive = location.pathname === '/explore'
  
  const handleClick = () => {
    // Navigate to explore page
    navigate('/explore')
    // Set active category to 'Trending'
    actions.setActiveCategory('Trending')
    // Reset search query
    actions.setSearchQuery('')
    // Load trending videos
    actions.setLoading(true)
  }

  return (
    <div 
      className={`menu-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="menu-item-icon">
        <ExploreIcon />
      </div>
      <span className="menu-item-label">Explore</span>
    </div>
  )
}

export default ExploreMenuItem
