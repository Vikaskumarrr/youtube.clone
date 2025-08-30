import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import Home from './pages/Home/Home'
import Explore from './pages/Explore/Explore'
import Library from './pages/Library/Library'
import VideoPlayer from './pages/VideoPlayer/VideoPlayer'
import SearchResults from './pages/SearchResults/SearchResults'
import './App.css'

function AppContent() {
  const { state } = useApp()
  
  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <Sidebar />
        <main className={`main-content ${state.sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
                        <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/library" element={<Library />} />
                <Route path="/watch" element={<VideoPlayer />} />
                <Route path="/results" element={<SearchResults />} />
              </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  )
}

export default App
