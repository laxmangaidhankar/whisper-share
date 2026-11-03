import { useState, useEffect } from 'react'
import './App.css'
import Header from '../components/home/Header'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import HowItWorks from '../components/home/HowItWorks'
import About from '../components/home/About'
import Footer from '../components/home/Footer'
import JoinRoom from '../pages/JoinRoom'
import CreateRoom from '../pages/CreateRoom'


function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (currentPath === '/join-room') {
    return <JoinRoom />
  }

  if (currentPath === '/create-room' || currentPath === '/create-room/name') {
    return <CreateRoom />
  }

  return (
    <div className="site" id="top">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <About />
      </main>
      <Footer />
    </div>
  )
}

export default App
