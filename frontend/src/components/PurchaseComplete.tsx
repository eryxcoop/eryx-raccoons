import { QRCodeSVG } from 'qrcode.react'
import { PurchaseResult } from '../App'
import './PurchaseComplete.css'

interface PurchaseCompleteProps {
  purchaseResult: PurchaseResult
  onReset: () => void
}

function PurchaseComplete({ purchaseResult, onReset }: PurchaseCompleteProps) {
  // Create QR code data object
  const qrData = {
    merkleTreeRoot: purchaseResult.merkleTreeRoot,
    documentNumber: purchaseResult.documentNumber,
    birthDate: purchaseResult.birthDate,
    merklePathDocument: purchaseResult.merklePathDocument,
    merklePathBirthDate: purchaseResult.merklePathBirthDate
  }

  const qrDataString = JSON.stringify(qrData)

  const handleDownload = () => {
    const jsonData = JSON.stringify(qrData, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `purchase-${purchaseResult.transactionID}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
            value={qrDataString}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      <div className="actions">
        <button onClick={handleDownload} className="button button-primary">
          Download Data
        </button>
        <button onClick={onReset} className="button button-secondary">
          New Purchase
        </button>
      </div>
    </div>
  )
}

export default PurchaseComplete

