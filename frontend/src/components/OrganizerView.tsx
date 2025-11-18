import { useState, useEffect } from 'react'
import { EventData } from '../App'
import './OrganizerView.css'

interface OrganizerViewProps {
  onNavigateToValidation: () => void
  onNavigateToCreateEvent: () => void
  onBack: () => void
}

function OrganizerView({ onNavigateToValidation, onNavigateToCreateEvent, onBack }: OrganizerViewProps) {
  const [events, setEvents] = useState<EventData[]>([])

  useEffect(() => {
    // Load events from localStorage
    const storedEvents: EventData[] = JSON.parse(localStorage.getItem('events') || '[]')
    setEvents(storedEvents)
  }, [])

  const handleValidate = (e: React.MouseEvent) => {
    e.stopPropagation()
    onNavigateToValidation()
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

  return (
    <div className="organizer-view">
      <h1 className="title">Organizer / Validator</h1>
      <p className="subtitle">Select an event to validate tickets or create a new event</p>
      
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
                onClick={handleValidate}
                className="button button-primary card-button"
              >
                Validate QR Code
              </button>
            </div>
          </div>
        ))}
        
        {/* Create Event Card */}
        <div
          className="event-card create-event-card"
          onClick={onNavigateToCreateEvent}
        >
          <div className="create-event-content">
            <div className="create-event-icon">+</div>
            <h3 className="create-event-title">Create New Event</h3>
            <p className="create-event-subtitle">Add a new event to the system</p>
          </div>
        </div>
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

export default OrganizerView

