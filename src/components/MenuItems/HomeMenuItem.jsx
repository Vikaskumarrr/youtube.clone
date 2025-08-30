import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import './MenuItems.css'

const HomeIcon = () => <span className="material-icons">home</span>

const HomeMenuItem = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { actions } = useApp()
  
  const isActive = location.pathname === '/'
  
  const handleClick = () => {
    // Navigate to home
    navigate('/')
    // Reset search query
    actions.setSearchQuery('')
    // Set active category to 'All'
    actions.setActiveCategory('All')
    // Load fresh videos
    actions.setLoading(true)
  }

  return (
    <div 
      className={`menu-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="menu-item-icon">
        <HomeIcon />
      </div>
      <span className="menu-item-label">Home</span>
    </div>
  )
}

export default HomeMenuItem
