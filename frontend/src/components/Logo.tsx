import { useState, useEffect } from 'react'
import cypherPassLogo from '../assets/cypherpass-logo.png'
import './Logo.css'

function Logo() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      setIsVisible(scrollY < 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`logo ${isVisible ? 'visible' : 'hidden'}`}>
      <img className="logo-image" src={cypherPassLogo} alt="CypherPass logo" />
    </div>
  )
}

export default Logo

