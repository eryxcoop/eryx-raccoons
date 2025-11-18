import { useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { EventData } from '../App'
import './MerklePathGenerator.css'

interface MerkleTree {
  leaves: string[]
  nodes: string[]
}

interface StoredMerkleData {
  merkleTree: MerkleTree
  merkleTreeRoot: string
  personalData: {
    name: string
    email: string
    documentNumber: string
    birthDate: string
  }
}

type SelectedField = 'name' | 'email' | 'documentNumber' | 'birthDate'

interface MerklePathGeneratorProps {
  initialEventName?: string
}

function MerklePathGenerator({ initialEventName }: MerklePathGeneratorProps) {
  const [events, setEvents] = useState<EventData[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string>(initialEventName || '')
  const [storedMerkleData, setStoredMerkleData] = useState<StoredMerkleData | null>(null)
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([])
  const [generatedQR, setGeneratedQR] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const generatedQRRef = useRef<SVGSVGElement>(null)

  const availableFields: { key: SelectedField; label: string }[] = [
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'documentNumber', label: 'Document Number' },
    { key: 'birthDate', label: 'Birth Date' }
  ]

  const handleEventSelect = (eventName: string) => {
    setSelectedEvent(eventName)
    setError('')
    
    // Load merkle tree data for selected event
    const merkleTreesKey = 'merkleTrees'
    const merkleTrees = JSON.parse(localStorage.getItem(merkleTreesKey) || '{}')
    
    if (merkleTrees[eventName]) {
      setStoredMerkleData(merkleTrees[eventName])
      setSelectedFields([])
      setGeneratedQR(null)
    } else {
      setError('No purchase found for this event. Please purchase a ticket first.')
      setStoredMerkleData(null)
    }
  }

  useEffect(() => {
    // Load events from localStorage
    const storedEvents: EventData[] = JSON.parse(localStorage.getItem('events') || '[]')
    setEvents(storedEvents)
    
    // If initialEventName is provided, automatically load the merkle data
    if (initialEventName) {
      handleEventSelect(initialEventName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEventName])

  const toggleField = (field: SelectedField) => {
    setSelectedFields(prev => {
      if (prev.includes(field)) {
        return prev.filter(f => f !== field)
      } else {
        return [...prev, field]
      }
    })
  }

  const generateMerklePaths = () => {
    if (!storedMerkleData || selectedFields.length === 0) {
      setError('Please select an event and at least one field')
      return
    }

    // Generate mock merkle paths for selected fields
    const generatePath = (): string[] => {
      const pathLength = Math.floor(Math.random() * 5) + 3
      return Array.from({ length: pathLength }, () => 
        '0x' + Math.random().toString(16).substr(2, 64)
      )
    }

    const merklePaths: Record<string, string[]> = {}
    selectedFields.forEach(field => {
      merklePaths[field] = generatePath()
    })

    // Create QR data with merkle paths and merkleTreeRoot
    const qrData = {
      merkleTreeRoot: storedMerkleData.merkleTreeRoot,
      merklePaths: merklePaths
    }

    setGeneratedQR(JSON.stringify(qrData))
    setError('')
  }

  const handleDownloadQR = () => {
    if (!generatedQRRef.current || !generatedQR) return

    const svg = generatedQRRef.current
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `merkle-paths-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }
        }, 'image/png')
      }
    }

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    img.src = url
  }

  return (
    <div className="merkle-path-generator">
      {!generatedQR && (
        <>
          <h1 className="title">Generate Credentials</h1>
          <p className="subtitle">Select an event and choose the fields required for your credential.</p>
        </>
      )}

      {!storedMerkleData && !initialEventName && (
        <div className="event-selection-section">
          <h2 className="section-title">Select Event</h2>
          <p className="section-subtitle">Choose an event for which you have purchased a ticket</p>

          {events.length === 0 ? (
            <p className="no-events-message">No events available. Please purchase a ticket first.</p>
          ) : (
            <div className="events-list">
              {events.map(event => (
                <button
                  key={event.name}
                  onClick={() => handleEventSelect(event.name)}
                  className={`event-button ${selectedEvent === event.name ? 'selected' : ''}`}
                >
                  {event.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {storedMerkleData && !generatedQR && (
        <div className="selection-section">
          <h2 className="section-title">Select Fields</h2>
          <p className="section-subtitle">Choose which fields to generate credentials for</p>

          <div className="fields-grid">
            {availableFields.map(field => (
              <label key={field.key} className="field-checkbox">
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field.key)}
                  onChange={() => toggleField(field.key)}
                />
                <span>{field.label}</span>
              </label>
            ))}
          </div>

          <div className="actions">
            <button
              onClick={() => {
                setStoredMerkleData(null)
                setSelectedEvent('')
                setSelectedFields([])
              }}
              className="button button-secondary"
            >
              Change Event
            </button>
            <button
              onClick={generateMerklePaths}
              disabled={selectedFields.length === 0}
              className="button button-primary"
            >
              Generate Credentials
            </button>
          </div>
        </div>
      )}

      {generatedQR && (
        <div className="result-section">
          <h2 className="section-title">Generated Credential</h2>
          <p className="section-subtitle">Download this credential or show it directly to the validator.</p>

          <div className="qr-container">
            <div className="qr-code-wrapper">
              <QRCodeSVG
                ref={generatedQRRef}
                value={generatedQR}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          <button
            onClick={handleDownloadQR}
            className="button button-primary"
          >
            Download Credential
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  )
}

export default MerklePathGenerator

