import { useState } from 'react'
import { EventData, PersonalData, PurchaseResult } from '../App'
import PersonalDataForm from './PersonalDataForm'
import './EventDetails.css'

interface EventDetailsProps {
  eventData: EventData
  onPurchaseComplete: (result: PurchaseResult) => void
}

function EventDetails({ eventData, onPurchaseComplete }: EventDetailsProps) {
  const [isPurchasing, setIsPurchasing] = useState(false)

  const generateMerklePath = (): string[] => {
    // Generate mock merkle path (array of hashes)
    const pathLength = Math.floor(Math.random() * 5) + 3 // 3-7 hashes
    return Array.from({ length: pathLength }, () => 
      '0x' + Math.random().toString(16).substr(2, 64)
    )
  }

  const handlePurchase = async (personalData: PersonalData) => {
    setIsPurchasing(true)

    // Simulate purchase process
    setTimeout(() => {
      // Generate mock purchase data
      const merkleTreeRoot = '0x' + Math.random().toString(16).substr(2, 64)
      const merkleTree = {
        leaves: [
          '0x' + Math.random().toString(16).substr(2, 64),
          '0x' + Math.random().toString(16).substr(2, 64),
          '0x' + Math.random().toString(16).substr(2, 64)
        ],
        nodes: [
          '0x' + Math.random().toString(16).substr(2, 64),
          '0x' + Math.random().toString(16).substr(2, 64)
        ]
      }

      // Save merkle tree to localStorage mapped to the event
      const merkleTreesKey = 'merkleTrees'
      const existingMerkleTrees = JSON.parse(localStorage.getItem(merkleTreesKey) || '{}')
      existingMerkleTrees[eventData.name] = {
        merkleTree: merkleTree,
        merkleTreeRoot: merkleTreeRoot,
        personalData: personalData
      }
      localStorage.setItem(merkleTreesKey, JSON.stringify(existingMerkleTrees))

      const purchaseResult: PurchaseResult = {
        merkleTree: JSON.stringify(merkleTree),
        merkleTreeRoot: merkleTreeRoot,
        name: personalData.name,
        email: personalData.email,
        documentNumber: personalData.documentNumber,
        birthDate: personalData.birthDate,
        merklePathDocument: generateMerklePath(),
        merklePathBirthDate: generateMerklePath(),
        transactionID: 'mn_shield-addr_test1kjwksfp8x2tachehsfvufsdl35ljg5cxzdcysjdn6ntadspyxn3qxqrxypgjm055c2azrpuyn7un0ge2vm25vkfv38d24rj3ewcku5wmdc94gjr9'
      }

      setIsPurchasing(false)
      onPurchaseComplete(purchaseResult)
    }, 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
    <div className="event-details">
      <h1 className="title">Event Details</h1>
      
      <div className="event-info-card">
        <h2 className="event-name">{eventData.name}</h2>
        <div className="event-description">
          <p>{eventData.description}</p>
        </div>
        <div className="event-detail-row">
          <span className="event-detail-label">Date:</span>
          <span className="event-detail-value">{formatDate(eventData.date)}</span>
        </div>
        <div className="event-detail-row">
          <span className="event-detail-label">Capacity:</span>
          <span className="event-detail-value">{eventData.capacity.toLocaleString()} tickets</span>
        </div>
        <div className="event-detail-row">
          <span className="event-detail-label">Price:</span>
          <span className="event-detail-value price">{formatPrice(eventData.price)}</span>
        </div>
      </div>

      <div className="divider"></div>

      <h2 className="section-title">Personal Information</h2>
      <p className="section-subtitle">Complete your information to finalize the purchase</p>

      <PersonalDataForm
        onSubmit={handlePurchase}
        isSubmitting={isPurchasing}
      />
    </div>
  )
}

export default EventDetails

