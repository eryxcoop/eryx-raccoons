import { useState, useEffect } from 'react'
import { EventData } from '../App'
import './EventCodeInput.css'

interface EventCodeInputProps {
  onEventFound: (eventData: EventData) => void
  onBack: () => void
}

function EventCodeInput({ onEventFound, onBack }: EventCodeInputProps) {
  const [selectedEventId, setSelectedEventId] = useState('')
  const [events, setEvents] = useState<EventData[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    // Load events from localStorage
    const storedEvents: EventData[] = JSON.parse(localStorage.getItem('events') || '[]')
    setEvents(storedEvents)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedEventId) {
      setError('Please select an event')
      return
    }

    const selectedEvent = events.find(event => event.name === selectedEventId)

    if (!selectedEvent) {
      setError('Event not found')
      return
    }

    setError('')
    onEventFound(selectedEvent)
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
      <p className="subtitle">Select an event to continue</p>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label htmlFor="eventSelect">Select Event</label>
          <select
            id="eventSelect"
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value)
              setError('')
            }}
            className="input"
          >
            <option value="">-- Select an event --</option>
            {events.map((event) => (
              <option key={event.name} value={event.name}>
                {event.name}
              </option>
            ))}
          </select>
          {error && <span className="error-message">{error}</span>}
        </div>

        <button
          type="submit"
          disabled={!selectedEventId}
          className="button button-primary"
        >
          Continue
        </button>
      </form>

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

