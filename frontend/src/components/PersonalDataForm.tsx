import { useState } from 'react'
import { PersonalData } from '../App'
import './PersonalDataForm.css'

interface PersonalDataFormProps {
  onSubmit: (data: PersonalData) => void
  isSubmitting: boolean
}

function PersonalDataForm({ onSubmit, isSubmitting }: PersonalDataFormProps) {
  const [formData, setFormData] = useState<PersonalData>({
    name: '',
    age: 0,
    email: '',
    documentNumber: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (formData.age <= 0 || formData.age > 120) {
      newErrors.age = 'Age must be a valid number between 1 and 120'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is not valid'
    }

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'Document number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof PersonalData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="personal-data-form">
      <div className="form-grid">
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="John Doe"
            disabled={isSubmitting}
            className={errors.name ? 'input error' : 'input'}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            min="1"
            max="120"
            value={formData.age || ''}
            onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
            placeholder="25"
            disabled={isSubmitting}
            className={errors.age ? 'input error' : 'input'}
          />
          {errors.age && <span className="error-message">{errors.age}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            disabled={isSubmitting}
            className={errors.email ? 'input error' : 'input'}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="documentNumber">Document Number</label>
          <input
            id="documentNumber"
            type="text"
            value={formData.documentNumber}
            onChange={(e) => handleChange('documentNumber', e.target.value)}
            placeholder="12345678"
            disabled={isSubmitting}
            className={errors.documentNumber ? 'input error' : 'input'}
          />
          {errors.documentNumber && (
            <span className="error-message">{errors.documentNumber}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="button button-primary"
      >
        {isSubmitting ? 'Processing purchase...' : 'Purchase Ticket'}
      </button>
    </form>
  )
}

export default PersonalDataForm

