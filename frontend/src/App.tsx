import { useEffect, useState } from 'react'
import Home from './components/Home'
import CreateEvent from './components/CreateEvent'
import EventCodeInput from './components/EventCodeInput'
import OrganizerView from './components/OrganizerView'
import EventDetails from './components/EventDetails'
import PurchaseComplete from './components/PurchaseComplete'
import QRValidator from './components/QRValidator'
import MerklePathGenerator from './components/MerklePathGenerator'
import NavigationHeader from './components/NavigationHeader'
import Logo from './components/Logo'
import Toast from './components/Toast'
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
  const [history, setHistory] = useState<Step[]>([])
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null)
  const [createEventFrom, setCreateEventFrom] = useState<'home' | 'organizer'>('home')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 3000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const navigateTo = (newStep: Step) => {
    if (step !== 'home' && step !== newStep) {
      setHistory(prev => [...prev, step])
    }
    setStep(newStep)
  }

  const handleEventFound = (data: EventData) => {
    setEventData(data)
    navigateTo('event-details')
  }

  const handlePurchaseComplete = (result: PurchaseResult) => {
    setPurchaseResult(result)
    navigateTo('purchase-complete')
  }

  const handleReset = () => {
    setStep('code-input')
    setEventData(null)
    setPurchaseResult(null)
    setHistory([])
  }

  const handleBackToHome = () => {
    setStep('home')
    setEventData(null)
    setPurchaseResult(null)
    setHistory([])
  }

  const handleBack = () => {
    if (history.length > 0) {
      const previousStep = history[history.length - 1]
      setHistory(prev => prev.slice(0, -1))
      setStep(previousStep)
      
      // Reset data when going back from certain steps
      if (previousStep === 'code-input' || previousStep === 'home') {
        setEventData(null)
        setPurchaseResult(null)
      }
    } else {
      handleBackToHome()
    }
  }

  return (
    <>
      <div className="background-decorations">
        <span className="decoration decoration-1">c = m^e</span>
        <span className="decoration decoration-2">(mod n)</span>
        <span className="decoration decoration-3">H(x)</span>
        <span className="decoration decoration-4">Merkle</span>
        <span className="decoration decoration-5">256</span>
        <span className="decoration decoration-6">ZK</span>
        <span className="decoration decoration-7">∀x</span>
        <span className="decoration decoration-8">∃y</span>
        <span className="decoration decoration-9">π</span>
        <span className="decoration decoration-10">e</span>
        <span className="decoration decoration-11">φ(n)</span>
        <span className="decoration decoration-12">SHA</span>
        <span className="decoration decoration-13">H(x)</span>
        <span className="decoration decoration-14">Merkle</span>
        <span className="decoration decoration-15">256</span>
        <span className="decoration decoration-16">ZK</span>
      </div>
      <Logo />
      {step !== 'home' && (
        <NavigationHeader
          onHome={handleBackToHome}
          onBack={handleBack}
          showBack={history.length > 0}
        />
      )}
      {toastMessage && <Toast message={toastMessage} />}
      <div className="app-wrapper">
        <div className="container">
        {step === 'home' && (
          <Home
            onNavigateToPurchase={() => navigateTo('code-input')}
            onNavigateToOrganizer={() => navigateTo('organizer-view')}
          />
        )}
        {step === 'create-event' && (
          <CreateEvent
            onEventCreated={() => {
              setToastMessage('Event saved! It is now available for attendees.')
              setStep(createEventFrom === 'organizer' ? 'organizer-view' : 'home')
              setHistory([])
            }}
          />
        )}
        {step === 'code-input' && (
          <EventCodeInput
            onEventFound={handleEventFound}
            onNavigateToMerklePath={() => navigateTo('merkle-path-generator')}
          />
        )}
        {step === 'organizer-view' && (
          <OrganizerView
            onNavigateToValidation={() => navigateTo('qr-validation')}
            onNavigateToCreateEvent={() => {
              setCreateEventFrom('organizer')
              navigateTo('create-event')
            }}
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
          />
        )}
        {step === 'qr-validation' && (
          <QRValidator />
        )}
        {step === 'merkle-path-generator' && (
          <MerklePathGenerator />
        )}
        </div>
      </div>
    </>
  )
}

export default App

