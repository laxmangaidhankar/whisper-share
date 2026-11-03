import { useState, useEffect } from 'react'

import JoinRoom from '../pages/JoinRoom'
import CreateRoom from '../pages/CreateRoom'
import LandingPage from '../pages/LandingPage'
import './App.css'
function App() {
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname
  )

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  if (currentPath === '/join-room') {
    return <JoinRoom />
  }

  if (
    currentPath === '/create-room' ||
    currentPath === '/create-room/name'
  ) {
    return <CreateRoom />
  }

  return <LandingPage />
}

export default App
