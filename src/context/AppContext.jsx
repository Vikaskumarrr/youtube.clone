import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Initial state
const initialState = {
  theme: 'dark',
  sidebarCollapsed: false, // false = expanded, true = collapsed
  videos: [],
  searchQuery: '',
  loading: false,
  selectedVideo: null,
  relatedVideos: [],
  searchResults: [],
  categories: [
    'All', 'Music', 'Gaming', 'Movies', 'News', 'Sports', 'Technology', 
    'Comedy', 'Education', 'Travel', 'Food', 'Fashion'
  ],
  activeCategory: 'All'
}

// Action types
const ActionTypes = {
  SET_THEME: 'SET_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR_STATE: 'SET_SIDEBAR_STATE',
  SET_VIDEOS: 'SET_VIDEOS',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_LOADING: 'SET_LOADING',
  SET_SELECTED_VIDEO: 'SET_SELECTED_VIDEO',
  SET_RELATED_VIDEOS: 'SET_RELATED_VIDEOS',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_ACTIVE_CATEGORY: 'SET_ACTIVE_CATEGORY'
}

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload }
    case ActionTypes.TOGGLE_SIDEBAR:
      // Toggle sidebar: false (expanded) <-> true (collapsed)
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
    case ActionTypes.SET_SIDEBAR_STATE:
      // Set sidebar to specific state
      return { ...state, sidebarCollapsed: action.payload }
    case ActionTypes.SET_VIDEOS:
      return { ...state, videos: action.payload }
    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload }
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload }
    case ActionTypes.SET_SELECTED_VIDEO:
      return { ...state, selectedVideo: action.payload }
    case ActionTypes.SET_RELATED_VIDEOS:
      return { ...state, relatedVideos: action.payload }
    case ActionTypes.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload }
    case ActionTypes.SET_ACTIVE_CATEGORY:
      return { ...state, activeCategory: action.payload }
    default:
      return state
  }
}

// Create context
const AppContext = createContext()

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Action creators - define these first
  const actions = {
    setTheme: (theme) => dispatch({ type: ActionTypes.SET_THEME, payload: theme }),
    toggleSidebar: () => {
      console.log('Toggling sidebar from:', state.sidebarCollapsed, 'to:', !state.sidebarCollapsed)
      dispatch({ type: ActionTypes.TOGGLE_SIDEBAR })
    }, // Toggle sidebar expanded/collapsed
    setSidebarState: (collapsed) => {
      console.log('Setting sidebar state to:', collapsed)
      dispatch({ type: ActionTypes.SET_SIDEBAR_STATE, payload: collapsed })
    }, // Set sidebar to specific state

    setVideos: (videos) => dispatch({ type: ActionTypes.SET_VIDEOS, payload: videos }),
    setSearchQuery: (query) => dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query }),
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setSelectedVideo: (video) => dispatch({ type: ActionTypes.SET_SELECTED_VIDEO, payload: video }),
    setRelatedVideos: (videos) => dispatch({ type: ActionTypes.SET_RELATED_VIDEOS, payload: videos }),
    setSearchResults: (results) => dispatch({ type: ActionTypes.SET_SEARCH_RESULTS, payload: results }),
    setActiveCategory: (category) => dispatch({ type: ActionTypes.SET_ACTIVE_CATEGORY, payload: category })
  }

  // Load theme and sidebar state from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('youtube-clone-theme')
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        dispatch({ type: ActionTypes.SET_THEME, payload: savedTheme })
      }
      
      const savedSidebarState = localStorage.getItem('youtube-clone-sidebar')
      if (savedSidebarState !== null) {
        const parsedState = JSON.parse(savedSidebarState)
        if (typeof parsedState === 'boolean') {
          dispatch({ type: ActionTypes.SET_SIDEBAR_STATE, payload: parsedState })
        }
      }
    } catch (error) {
      console.warn('Error loading saved preferences:', error)
    }
  }, [])

  // Update document theme when theme changes
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', state.theme)
      localStorage.setItem('youtube-clone-theme', state.theme)
    } catch (error) {
      console.warn('Error saving theme preference:', error)
    }
  }, [state.theme])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('youtube-clone-sidebar', JSON.stringify(state.sidebarCollapsed))
    } catch (error) {
      console.warn('Error saving sidebar preference:', error)
    }
  }, [state.sidebarCollapsed])

  // Keyboard shortcuts for sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      try {
        // Escape key to close sidebar
        if (e.key === 'Escape' && !state.sidebarCollapsed) {
          actions.toggleSidebar()
        }
        // Ctrl+B to toggle sidebar
        if (e.ctrlKey && e.key === 'b') {
          e.preventDefault()
          actions.toggleSidebar()
        }
      } catch (error) {
        console.warn('Error handling keyboard shortcut:', error)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state.sidebarCollapsed, actions])

  const value = {
    state,
    actions
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
