import './Home.css'

interface HomeProps {
  onNavigateToPurchase: () => void
  onNavigateToOrganizer: () => void
}

function Home({ onNavigateToPurchase, onNavigateToOrganizer }: HomeProps) {
  return (
    <div className="home">
      <h1 className="title">CipherPass</h1>
      <p className="subtitle">
        Empowering people to buy tickets directly—no intermediaries, no oversharing.
      </p>
      
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

