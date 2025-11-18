import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { PurchaseResult } from '../App'
import './PurchaseComplete.css'

interface PurchaseCompleteProps {
  purchaseResult: PurchaseResult
  onReset: () => void
  onBack: () => void
}

function PurchaseComplete({ purchaseResult, onReset, onBack }: PurchaseCompleteProps) {
  const qrRef = useRef<SVGSVGElement>(null)

  // QR code contains the merkleTree and personal data
  const qrData = {
    merkleTree: JSON.parse(purchaseResult.merkleTree),
    name: purchaseResult.name,
    email: purchaseResult.email,
    documentNumber: purchaseResult.documentNumber,
    birthDate: purchaseResult.birthDate
  }
  const qrDataString = JSON.stringify(qrData)

  const handleDownload = () => {
    if (!qrRef.current) return

    const svg = qrRef.current
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
            link.download = `ticket-qr-${purchaseResult.transactionID}.png`
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
    <div className="purchase-complete">
      <div className="success-icon">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M8 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="title">Purchase Successful!</h1>
      <p className="subtitle">Your ticket has been purchased successfully</p>

      <div className="transaction-info">
        <div className="info-item">
          <span className="info-label">Transaction ID:</span>
          <span className="info-value">{purchaseResult.transactionID}</span>
        </div>
      </div>

      <div className="qr-container">
        <h3 className="qr-title">Your Ticket QR Code</h3>
        <p className="qr-subtitle">Scan this QR code to verify your ticket</p>
        <div className="qr-code-wrapper">
          <QRCodeSVG
            ref={qrRef}
            value={qrDataString}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      <div className="actions">
        <button onClick={handleDownload} className="button button-primary">
          Download QR Code
        </button>
        <button onClick={onReset} className="button button-secondary">
          New Purchase
        </button>
        <button onClick={onBack} className="button button-secondary">
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default PurchaseComplete

