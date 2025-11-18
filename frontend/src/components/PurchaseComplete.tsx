import { PurchaseResult } from '../App'
import './PurchaseComplete.css'

interface PurchaseCompleteProps {
  purchaseResult: PurchaseResult
  onReset: () => void
}

function PurchaseComplete({ purchaseResult, onReset }: PurchaseCompleteProps) {
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

      <div className="actions">
        <button onClick={onReset} className="button button-primary">
          New Purchase
        </button>
      </div>
    </div>
  )
}

export default PurchaseComplete

