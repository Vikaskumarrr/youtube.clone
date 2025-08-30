import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  HomeMenuItem,
  ExploreMenuItem,
  SubscriptionsMenuItem,
  LibraryMenuItem,
  HistoryMenuItem,
  YourVideosMenuItem,
  WatchLaterMenuItem,
  LikedVideosMenuItem
} from '../MenuItems'
import './Sidebar.css'



const Sidebar = () => {
  const { state, actions } = useApp()
  const navigate = useNavigate()



  // Main navigation sections
  const mainSections = [
    <HomeMenuItem key="home" />,
    <ExploreMenuItem key="explore" />,
    <SubscriptionsMenuItem key="subscriptions" />
  ]

  // Library and user content sections
  const librarySections = [
    <LibraryMenuItem key="library" />,
    <HistoryMenuItem key="history" />,
    <YourVideosMenuItem key="your-videos" />,
    <WatchLaterMenuItem key="watch-later" />,
    <LikedVideosMenuItem key="liked-videos" />
  ]



  const SidebarSection = ({ items, showDivider = true }) => (
    <div className="sidebar-section">
      <div className="sidebar-items">
        {items}
      </div>
      {showDivider && <div className="sidebar-divider"></div>}
    </div>
  )

  // Compact sidebar for mobile/collapsed state
  const CompactSidebar = () => (
    <div className="sidebar sidebar-compact">
      <div className="sidebar-content">
        {/* Main navigation items */}
        <div className="sidebar-section">
          <div className="sidebar-items">
            <div className="compact-item" onClick={() => navigate('/')}>
              <span className="material-icons compact-icon">home</span>
              <span className="compact-label">Home</span>
            </div>
            <div className="compact-item" onClick={() => navigate('/explore')}>
              <span className="material-icons compact-icon">explore</span>
              <span className="compact-label">Explore</span>
            </div>
            <div className="compact-item" onClick={() => navigate('/subscriptions')}>
              <span className="material-icons compact-icon">subscriptions</span>
              <span className="compact-label">Subscriptions</span>
            </div>
          </div>
        </div>
        
        <div className="sidebar-divider"></div>
        
        {/* Library items */}
        <div className="sidebar-section">
          <div className="sidebar-items">
            <div className="compact-item" onClick={() => navigate('/library')}>
              <span className="material-icons compact-icon">video_library</span>
              <span className="compact-label">Library</span>
            </div>
            <div className="compact-item" onClick={() => navigate('/history')}>
              <span className="material-icons compact-icon">history</span>
              <span className="compact-label">History</span>
            </div>
            <div className="compact-item" onClick={() => navigate('/your-videos')}>
              <span className="material-icons compact-icon">smart_display</span>
              <span className="compact-label">Your videos</span>
            </div>
            <div className="compact-item" onClick={() => navigate('/watch-later')}>
              <span className="material-icons compact-icon">watch_later</span>
              <span className="compact-label">Watch later</span>
            </div>
                        <div className="compact-item" onClick={() => navigate('/liked-videos')}>
              <span className="material-icons compact-icon">thumb_up</span>
              <span className="compact-label">Liked videos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Full sidebar
  const FullSidebar = () => (
    <div className="sidebar sidebar-full">
      <div className="sidebar-content">
        <SidebarSection 
          items={mainSections}
          showDivider={true}
        />
        
        <SidebarSection 
          items={librarySections}
          showDivider={true}
        />
        
        <div className="sidebar-footer">
          <div className="sidebar-footer-links">
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Press</a>
            <a href="#" className="footer-link">Copyright</a>
            <a href="#" className="footer-link">Contact us</a>
            <a href="#" className="footer-link">Creator</a>
            <a href="#" className="footer-link">Advertise</a>
            <a href="#" className="footer-link">Developers</a>
          </div>
          <div className="sidebar-footer-links">
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Policy & Safety</a>
            <a href="#" className="footer-link">How YouTube works</a>
            <a href="#" className="footer-link">Test new features</a>
          </div>
          <div className="sidebar-footer-copyright">
            © 2024 YouTube Clone
          </div>
        </div>
      </div>
    </div>
  )

  // Debug logging
  console.log('Sidebar state:', state.sidebarCollapsed ? 'collapsed' : 'expanded')

  return (
    <>
      {/* Overlay for mobile - only show when sidebar is expanded */}
      {!state.sidebarCollapsed && (
        <div 
          className="sidebar-overlay"
          onClick={actions.toggleSidebar}
        />
      )}
      
      {/* Sidebar - show compact when collapsed, full when expanded */}
      {state.sidebarCollapsed ? <CompactSidebar /> : <FullSidebar />}
    </>
  )
}

export default Sidebar
