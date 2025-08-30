import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import './MenuItems.css'

const SubscriptionsIcon = () => <span className="material-icons">subscriptions</span>

const SubscriptionsMenuItem = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { actions } = useApp()
  
  const isActive = location.pathname === '/subscriptions'
  
  const handleClick = () => {
    // Navigate to subscriptions page
    navigate('/subscriptions')
    // Set active category to 'Subscriptions'
    actions.setActiveCategory('Subscriptions')
    // Reset search query
    actions.setSearchQuery('')
    // Load subscription videos
    actions.setLoading(true)
  }

  return (
    <div 
      className={`menu-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="menu-item-icon">
        <SubscriptionsIcon />
      </div>
      <span className="menu-item-label">Subscriptions</span>
    </div>
  )
}

export default SubscriptionsMenuItem
