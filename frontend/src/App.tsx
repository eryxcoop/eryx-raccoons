import { useState } from 'react'
import Home from './components/Home'
import EventCodeInput from './components/EventCodeInput'
import EventDetails from './components/EventDetails'
import PersonalDataForm from './components/PersonalDataForm'
import PurchaseComplete from './components/PurchaseComplete'
import QRValidator from './components/QRValidator'
import './App.css'

export interface EventData {
  name: string
  date: string
  price: number
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
  documentNumber: string
  birthDate: string
  merklePathDocument: string[]
  merklePathBirthDate: string[]
  transactionID: string
}

type Step = 'home' | 'code-input' | 'event-details' | 'purchase-complete' | 'qr-validation'

function App() {
  const [step, setStep] = useState<Step>('home')
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null)

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
            onNavigateToValidation={() => setStep('qr-validation')}
          />
        )}
        {step === 'code-input' && (
          <EventCodeInput
            onEventFound={handleEventFound}
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
      </div>
    </div>
  )
}

export default App

