import './Home.css'

interface HomeProps {
  onNavigateToPurchase: () => void
  onNavigateToCreateEvent: () => void
  onNavigateToValidation: () => void
}

function Home({ onNavigateToPurchase, onNavigateToCreateEvent, onNavigateToValidation }: HomeProps) {
  return (
    <div className="home">
      <h1 className="title">Eryx Raccoons</h1>
      <p className="subtitle">Ticket Management System</p>
      
      <div className="actions">
        <button
          onClick={onNavigateToPurchase}
          className="button button-primary"
        >
          Purchase Ticket
        </button>
        <button
          onClick={onNavigateToCreateEvent}
          className="button button-secondary"
        >
          Create Event
        </button>
        <button
          onClick={onNavigateToValidation}
          className="button button-secondary"
        >
          Validate QR Code
        </button>
      </div>
    </div>
  )
}

export default Home

