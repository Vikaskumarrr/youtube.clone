import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import VideoCard from '../../components/VideoCard/VideoCard'
import { searchVideos } from '../../utils/youtube'
import './SearchResults.css'

const SearchResults = () => {
  const location = useLocation()
  const { state, actions } = useApp()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [nextPageToken, setNextPageToken] = useState('')

  // Get search query from URL
  const urlParams = new URLSearchParams(location.search)
  const searchQuery = urlParams.get('search_query') || ''

  useEffect(() => {
    if (searchQuery) {
      loadSearchResults(searchQuery)
      actions.setSearchQuery(searchQuery)
    }
  }, [searchQuery])

  const loadSearchResults = async (query, pageToken = '') => {
    try {
      setLoading(true)
      setError(null)

      const data = await searchVideos(query, 25, pageToken)
      
      if (pageToken) {
        // Load more results (append)
        setVideos(prev => [...prev, ...data.items])
      } else {
        // New search results
        setVideos(data.items)
      }
      
      setNextPageToken(data.nextPageToken || '')
      actions.setSearchResults(data.items)
    } catch (err) {
      console.error('Error searching videos:', err)
      setError('Failed to search videos. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (nextPageToken && !loading && searchQuery) {
      loadSearchResults(searchQuery, nextPageToken)
    }
  }

  const LoadingList = () => (
    <div className="search-results-list">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="search-result-skeleton">
          <div className="skeleton-thumbnail"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-metadata"></div>
            <div className="skeleton-channel"></div>
            <div className="skeleton-description"></div>
          </div>
        </div>
      ))}
    </div>
  )

  if (error) {
    return (
      <div className="search-results-page">
        <div className="error-container">
          <div className="error-content">
            <h2>Search failed</h2>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => loadSearchResults(searchQuery)}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="search-results-page">
      <div className="search-results-container">
        {/* Search info */}
        <div className="search-info">
          <h2 className="search-title">
            Search results for "{searchQuery}"
          </h2>
          {!loading && videos.length > 0 && (
            <p className="results-count">
              About {videos.length}+ results
            </p>
          )}
        </div>

        {/* Filter options */}
        <div className="search-filters">
          <button className="filter-btn active">
            <span className="material-icons">tune</span>
            Filters
          </button>
          <div className="filter-chips">
            <button className="filter-chip active">All</button>
            <button className="filter-chip">Videos</button>
            <button className="filter-chip">Channels</button>
            <button className="filter-chip">Playlists</button>
            <button className="filter-chip">This week</button>
            <button className="filter-chip">This month</button>
            <button className="filter-chip">This year</button>
          </div>
        </div>

        {/* Results */}
        {loading && videos.length === 0 ? (
          <LoadingList />
        ) : videos.length === 0 ? (
          <div className="no-results">
            <div className="no-results-content">
              <h3>No results found</h3>
              <p>Try different keywords or remove search filters</p>
            </div>
          </div>
        ) : (
          <>
            <div className="search-results-list">
              {videos.map((video, index) => (
                <VideoCard
                  key={`${video.id?.videoId || video.id}-${index}`}
                  video={video}
                  layout="list"
                />
              ))}
            </div>

            {/* Load more */}
            {nextPageToken && (
              <div className="load-more-container">
                <button
                  className={`btn load-more-btn ${loading ? 'loading' : ''}`}
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading"></div>
                      Loading more...
                    </>
                  ) : (
                    'Load More Results'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchResults
