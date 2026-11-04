import { useState, useEffect } from 'react'

import JoinRoom from '../pages/JoinRoom'
import CreateRoom from '../pages/CreateRoom'
import LandingPage from '../pages/LandingPage'

import WhisperShareHome from '../pages/WhisperShareHome'
import LiveRoom from '../pages/LiveRoom'
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

  if(currentPath === '/dashboard'){
    return <WhisperShareHome/>
  }

  if (currentPath === '/room') {
    return <LiveRoom />
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
