import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import './MenuItems.css'

const HistoryIcon = () => <span className="material-icons">history</span>

const HistoryMenuItem = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { actions } = useApp()
  
  const isActive = location.pathname === '/history'
  
  const handleClick = () => {
    // Navigate to history page
    navigate('/history')
    // Set active category to 'History'
    actions.setActiveCategory('History')
    // Reset search query
    actions.setSearchQuery('')
    // Load watch history
    actions.setLoading(true)
  }

  return (
    <div 
      className={`menu-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="menu-item-icon">
        <HistoryIcon />
      </div>
      <span className="menu-item-label">History</span>
    </div>
  )
}

export default HistoryMenuItem
