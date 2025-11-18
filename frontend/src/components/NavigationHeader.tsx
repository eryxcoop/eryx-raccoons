import './NavigationHeader.css'

interface NavigationHeaderProps {
  onHome: () => void
  onBack?: () => void
  showBack?: boolean
}

function NavigationHeader({ onHome, onBack, showBack = true }: NavigationHeaderProps) {
  return (
    <div className="navigation-header">
      <button
        onClick={onHome}
        className="nav-button home-button"
        aria-label="Go to home"
        title="Home"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {showBack && onBack && (
        <button
          onClick={onBack}
          className="nav-button back-button"
          aria-label="Go back"
          title="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}

export default NavigationHeader

