import Header from '../components/home/Header'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import HowItWorks from '../components/home/HowItWorks'
import About from '../components/home/About'
import Footer from '../components/home/Footer'
import  './LandingPage.css'
function LandingPage() {
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

export default LandingPage
