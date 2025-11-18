import { useState, useEffect } from 'react'
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
      <svg 
        className="logo-icon" 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ticket/Circuit board shape */}
        <rect 
          x="4" 
          y="8" 
          width="32" 
          height="24" 
          rx="4" 
          fill="#220844"
        />
        {/* Rounded cutout on left side */}
        <path 
          d="M4 16C4 14.8954 4.89543 14 6 14H8C9.10457 14 10 14.8954 10 16V20C10 21.1046 9.10457 22 8 22H6C4.89543 22 4 21.1046 4 20V16Z" 
          fill="transparent"
        />
        {/* Inner blue elements */}
        <rect 
          x="8" 
          y="14" 
          width="8" 
          height="8" 
          rx="2" 
          fill="#5A74FC"
        />
        <rect 
          x="18" 
          y="16" 
          width="4" 
          height="4" 
          rx="1" 
          fill="#5A74FC"
        />
        <rect 
          x="24" 
          y="16" 
          width="4" 
          height="4" 
          rx="1" 
          fill="#5A74FC"
        />
      </svg>
      <span className="logo-text">cypherpass</span>
    </div>
  )
}

export default Logo

