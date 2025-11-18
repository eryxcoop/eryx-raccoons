import { useState } from 'react'
import { EventData } from '../App'
import './CreateEvent.css'

interface CreateEventProps {
  onEventCreated: () => void
}

function CreateEvent({ onEventCreated }: CreateEventProps) {
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    description: '',
    price: '',
    date: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required'
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = 'Capacity is required'
    } else {
      const capacity = parseInt(formData.capacity)
      if (isNaN(capacity) || capacity <= 0) {
        newErrors.capacity = 'Capacity must be a positive number'
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required'
    } else {
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Price must be a positive number'
      }
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required'
    } else {
      const date = new Date(formData.date)
      if (isNaN(date.getTime())) {
        newErrors.date = 'Invalid date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Get existing events from localStorage
    const existingEvents = JSON.parse(localStorage.getItem('events') || '[]')

    // Create new event
    const newEvent: EventData = {
      name: formData.name.trim(),
      capacity: parseInt(formData.capacity),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      date: formData.date
    }

    // Check if event name already exists
    if (existingEvents.some((e: EventData) => e.name.toLowerCase() === newEvent.name.toLowerCase())) {
      setErrors({ name: 'An event with this name already exists' })
      return
    }

    // Add new event to the list
    existingEvents.push(newEvent)

    // Save to localStorage
    localStorage.setItem('events', JSON.stringify(existingEvents))

    // Reset form and notify
    setFormData({
      name: '',
      capacity: '',
      description: '',
      price: '',
      date: ''
    })
    setErrors({})
    onEventCreated()
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="create-event">
      <h1 className="title">Create Event</h1>
      <p className="subtitle">Fill in the event details</p>

      <form onSubmit={handleSubmit} className="form" autoComplete="off">
        <div className="input-group">
          <label htmlFor="name">Event Name</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Rock Concert"
            autoComplete="off"
            className={errors.name ? 'input error' : 'input'}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', e.target.value)}
            placeholder="1000"
            autoComplete="off"
            className={errors.capacity ? 'input error' : 'input'}
          />
          {errors.capacity && <span className="error-message">{errors.capacity}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Event description..."
            rows={4}
            autoComplete="off"
            className={errors.description ? 'input error' : 'input'}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="price">Ticket Price</label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="15000"
            autoComplete="off"
            className={errors.price ? 'input error' : 'input'}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="date">Event Date</label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            autoComplete="off"
            className={errors.date ? 'input error' : 'input'}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        <button type="submit" className="button button-primary">
          Create Event
        </button>
      </form>
    </div>
  )
}

export default CreateEvent

