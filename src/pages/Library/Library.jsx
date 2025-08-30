import React from 'react'
import { useApp } from '../../context/AppContext'
import './Library.css'

const Library = () => {
  const { state } = useApp()

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>Library</h1>
        <p>Your videos, playlists, and saved content</p>
      </div>

      <div className="library-content">
        <div className="library-section">
          <h2>Recent Activity</h2>
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>Your library is empty</h3>
            <p>Start watching videos to build your library</p>
          </div>
        </div>

        <div className="library-section">
          <h2>Playlists</h2>
          <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <h3>No playlists yet</h3>
            <p>Create playlists to organize your favorite videos</p>
          </div>
        </div>

        <div className="library-section">
          <h2>Subscriptions</h2>
          <div className="empty-state">
            <div className="empty-icon">📺</div>
            <h3>No subscriptions</h3>
            <p>Subscribe to channels to see their latest videos here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Library
