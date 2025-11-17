import { useState } from 'react'
import { EventData } from '../App'
import './EventCodeInput.css'

interface EventCodeInputProps {
  onEventFound: (eventData: EventData) => void
}

function EventCodeInput({ onEventFound }: EventCodeInputProps) {
  const [eventCode, setEventCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!eventCode.trim()) {
      setError('Please enter an event code')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate event search
    setTimeout(() => {
      // Simulation: any code works, but you can change this
      const mockEventData: EventData = {
        name: 'Rock Concert',
        date: '2024-12-25',
        price: 15000
      }

      setIsLoading(false)
      onEventFound(mockEventData)
    }, 1500)
  }

  return (
    <div className="event-code-input">
      <h1 className="title">Ticket Purchase</h1>
      <p className="subtitle">Enter the event code to continue</p>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label htmlFor="eventCode">Event Code</label>
          <input
            id="eventCode"
            type="text"
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value)}
            placeholder="e.g., EVT-2024-001"
            disabled={isLoading}
            className="input"
          />
          {error && <span className="error-message">{error}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="button button-primary"
        >
          {isLoading ? 'Searching...' : 'Search Event'}
        </button>
      </form>
    </div>
  )
}

export default EventCodeInput

