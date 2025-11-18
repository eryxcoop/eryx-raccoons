import { useState } from 'react'
import Home from './components/Home'
import CreateEvent from './components/CreateEvent'
import EventCodeInput from './components/EventCodeInput'
import OrganizerView from './components/OrganizerView'
import EventDetails from './components/EventDetails'
import PersonalDataForm from './components/PersonalDataForm'
import PurchaseComplete from './components/PurchaseComplete'
import QRValidator from './components/QRValidator'
import MerklePathGenerator from './components/MerklePathGenerator'
import './App.css'

export interface EventData {
  name: string
  date: string
  price: number
  capacity: number
  description: string
}

export interface PersonalData {
  name: string
  email: string
  documentNumber: string
  birthDate: string
}

export interface PurchaseResult {
  merkleTree: string
  merkleTreeRoot: string
  name: string
  email: string
  documentNumber: string
  birthDate: string
  merklePathDocument: string[]
  merklePathBirthDate: string[]
  transactionID: string
}

type Step = 'home' | 'create-event' | 'code-input' | 'organizer-view' | 'event-details' | 'purchase-complete' | 'qr-validation' | 'merkle-path-generator'

function App() {
  const [step, setStep] = useState<Step>('home')
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null)
  const [createEventFrom, setCreateEventFrom] = useState<'home' | 'organizer'>('home')

  const handleEventFound = (data: EventData) => {
    setEventData(data)
    setStep('event-details')
  }

  const handlePurchaseComplete = (result: PurchaseResult) => {
    setPurchaseResult(result)
    setStep('purchase-complete')
  }

  const handleReset = () => {
    setStep('code-input')
    setEventData(null)
    setPurchaseResult(null)
  }

  const handleBackToHome = () => {
    setStep('home')
    setEventData(null)
    setPurchaseResult(null)
  }

  return (
    <div className="app">
      <div className="container">
        {step === 'home' && (
          <Home
            onNavigateToPurchase={() => setStep('code-input')}
            onNavigateToOrganizer={() => setStep('organizer-view')}
          />
        )}
        {step === 'create-event' && (
          <CreateEvent
            onEventCreated={() => {
              alert('Event created successfully!')
              setStep(createEventFrom === 'organizer' ? 'organizer-view' : 'home')
            }}
            onBack={() => {
              setStep(createEventFrom === 'organizer' ? 'organizer-view' : 'home')
            }}
          />
        )}
        {step === 'code-input' && (
          <EventCodeInput
            onEventFound={handleEventFound}
            onNavigateToMerklePath={() => setStep('merkle-path-generator')}
            onBack={handleBackToHome}
          />
        )}
        {step === 'organizer-view' && (
          <OrganizerView
            onNavigateToValidation={() => setStep('qr-validation')}
            onNavigateToCreateEvent={() => {
              setCreateEventFrom('organizer')
              setStep('create-event')
            }}
            onBack={handleBackToHome}
          />
        )}
        {step === 'event-details' && eventData && (
          <EventDetails
            eventData={eventData}
            onPurchaseComplete={handlePurchaseComplete}
          />
        )}
        {step === 'purchase-complete' && purchaseResult && (
          <PurchaseComplete
            purchaseResult={purchaseResult}
            onReset={handleReset}
            onBack={handleBackToHome}
          />
        )}
        {step === 'qr-validation' && (
          <QRValidator onBack={handleBackToHome} />
        )}
        {step === 'merkle-path-generator' && (
          <MerklePathGenerator onBack={handleBackToHome} />
        )}
      </div>
    </div>
  )
}

export default App

