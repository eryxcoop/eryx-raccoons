import './Home.css'

interface HomeProps {
  onNavigateToPurchase: () => void
  onNavigateToOrganizer: () => void
}

function Home({ onNavigateToPurchase, onNavigateToOrganizer }: HomeProps) {
  return (
    <div className="home">
      <h1 className="title">CypherPass</h1>
      <p className="subtitle">Ticket Management System</p>
      
      <div className="actions">
        <button
          onClick={onNavigateToPurchase}
          className="button button-primary"
        >
          Join as Attendee
        </button>
        <button
          onClick={onNavigateToOrganizer}
          className="button button-secondary"
        >
          Join as Organizer/Validator
        </button>
      </div>
    </div>
  )
}

export default Home

