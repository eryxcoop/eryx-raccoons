import './Home.css'

interface HomeProps {
  onNavigateToPurchase: () => void
  onNavigateToValidation: () => void
  onNavigateToMerklePath: () => void
  onNavigateToCreateEvent: () => void
}

function Home({ onNavigateToPurchase, onNavigateToValidation, onNavigateToMerklePath, onNavigateToCreateEvent }: HomeProps) {
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
        <button
          onClick={onNavigateToMerklePath}
          className="button button-secondary"
        >
          Generate Merkle Paths
        </button>
      </div>
    </div>
  )
}

export default Home

