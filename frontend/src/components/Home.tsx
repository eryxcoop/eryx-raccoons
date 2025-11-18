import './Home.css'

interface HomeProps {
  onNavigateToPurchase: () => void
  onNavigateToValidation: () => void
}

function Home({ onNavigateToPurchase, onNavigateToValidation }: HomeProps) {
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

