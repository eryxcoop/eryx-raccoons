import { useState, useEffect } from 'react'
import { EventData } from '../App'
import './EventCodeInput.css'

interface EventCodeInputProps {
  onEventFound: (eventData: EventData) => void
  onNavigateToMerklePath: () => void
  onBack: () => void
}

function EventCodeInput({ onEventFound, onNavigateToMerklePath, onBack }: EventCodeInputProps) {
  const [events, setEvents] = useState<EventData[]>([])

  useEffect(() => {
    // Load events from localStorage
    const storedEvents: EventData[] = JSON.parse(localStorage.getItem('events') || '[]')
    setEvents(storedEvents)
  }, [])

  const handlePurchase = (event: EventData, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventFound(event)
  }

  const handleGenerateMerklePaths = (e: React.MouseEvent) => {
    e.stopPropagation()
    onNavigateToMerklePath()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (events.length === 0) {
    return (
      <div className="event-code-input">
        <h1 className="title">Ticket Purchase</h1>
        <p className="subtitle">No events available</p>
        <p className="error-message">Please create an event first</p>
        <button
          onClick={onBack}
          className="button button-secondary back-button"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="event-code-input">
      <h1 className="title">Ticket Purchase</h1>
      <p className="subtitle">Select an event to purchase tickets or generate merkle paths</p>
      
      <div className="events-grid">
        {events.map((event) => (
          <div
            key={event.name}
            className="event-card"
          >
            <h3 className="event-card-name">{event.name}</h3>
            <p className="event-card-description">{event.description}</p>
            <div className="event-card-details">
              <div className="event-card-detail">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{formatDate(event.date)}</span>
              </div>
              <div className="event-card-detail">
                <span className="detail-label">Capacity:</span>
                <span className="detail-value">{event.capacity.toLocaleString()}</span>
              </div>
              <div className="event-card-detail">
                <span className="detail-label">Price:</span>
                <span className="detail-value price">{formatPrice(event.price)}</span>
              </div>
            </div>
            <div className="event-card-actions">
              <button
                onClick={(e) => handlePurchase(event, e)}
                className="button button-primary card-button"
              >
                Purchase
              </button>
              <button
                onClick={handleGenerateMerklePaths}
                className="button button-secondary card-button"
              >
                Generate Merkle Paths
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onBack}
        className="button button-secondary back-button"
      >
        Back to Home
      </button>
    </div>
  )
}

export default EventCodeInput

