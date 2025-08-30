import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import './Header.css'

// Icons (using Material Icons)
const MenuIcon = () => (
  <span className="material-icons">menu</span>
)

const CloseIcon = () => (
  <span className="material-icons">close</span>
)

const SearchIcon = () => (
  <span className="material-icons">search</span>
)

const MicIcon = () => (
  <span className="material-icons">mic</span>
)

const VideoCallIcon = () => (
  <span className="material-icons">video_call</span>
)

const AppsIcon = () => (
  <span className="material-icons">apps</span>
)

const NotificationsIcon = () => (
  <span className="material-icons">notifications</span>
)

const LightModeIcon = () => (
  <span className="material-icons">light_mode</span>
)

const DarkModeIcon = () => (
  <span className="material-icons">dark_mode</span>
)

const Header = () => {
  const { state, actions } = useApp()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showMobileSearch])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      actions.setSearchQuery(searchQuery)
      navigate(`/results?search_query=${encodeURIComponent(searchQuery)}`)
      setShowMobileSearch(false)
    }
  }

  const handleLogoClick = () => {
    navigate('/')
    actions.setSearchQuery('')
    setSearchQuery('')
  }

  const toggleTheme = () => {
    actions.setTheme(state.theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="btn btn-icon menu-btn"
          onClick={actions.toggleSidebar}
          aria-label="Toggle sidebar"
          title={`${state.sidebarCollapsed ? 'Expand' : 'Collapse'} sidebar`}
        >
          {state.sidebarCollapsed ? <MenuIcon /> : <CloseIcon />}
        </button>
        
        <div className="logo" onClick={handleLogoClick}>
          <img 
            src="/materials/Group1.png" 
            alt="YouTube" 
            className="logo-img"
          />
        </div>
      </div>

      <div className={`header-center ${showMobileSearch ? 'mobile-search-active' : ''}`}>
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-container">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button 
              type="submit" 
              className="search-btn"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </div>
          <button 
            type="button" 
            className="btn btn-icon mic-btn"
            aria-label="Search with your voice"
          >
            <MicIcon />
          </button>
        </form>
      </div>

      <div className="header-right">
        <button 
          className="btn btn-icon search-mobile-btn"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          aria-label="Search"
        >
          <SearchIcon />
        </button>
        
        <button 
          className="btn btn-icon theme-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${state.theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {state.theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </button>

        <button 
          className="btn btn-icon"
          aria-label="Create"
        >
          <VideoCallIcon />
        </button>

        <button 
          className="btn btn-icon"
          aria-label="YouTube apps"
        >
          <AppsIcon />
        </button>

        <button 
          className="btn btn-icon"
          aria-label="Notifications"
        >
          <NotificationsIcon />
        </button>

        <button 
          className="btn btn-icon profile-btn"
          aria-label="Account menu"
        >
          <img 
            src="/materials/Profile-pic.png" 
            alt="Profile" 
            className="profile-img"
          />
        </button>
      </div>
    </header>
  )
}

export default Header
