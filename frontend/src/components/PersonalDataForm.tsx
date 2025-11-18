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
    email: '',
    documentNumber: '',
    birthDate: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is not valid'
    }

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'Document number is required'
    }

    if (!formData.birthDate.trim()) {
      newErrors.birthDate = 'Birth date is required'
    } else {
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      if (birthDate > today) {
        newErrors.birthDate = 'Birth date cannot be in the future'
      }
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
    <form onSubmit={handleSubmit} className="personal-data-form" autoComplete="off">
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
            autoComplete="off"
            className={errors.name ? 'input error' : 'input'}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
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
            autoComplete="off"
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
            autoComplete="off"
            className={errors.documentNumber ? 'input error' : 'input'}
          />
          {errors.documentNumber && (
            <span className="error-message">{errors.documentNumber}</span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="birthDate">Birth Date</label>
          <input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            disabled={isSubmitting}
            autoComplete="off"
            className={errors.birthDate ? 'input error' : 'input'}
          />
          {errors.birthDate && (
            <span className="error-message">{errors.birthDate}</span>
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

