import './Toast.css'

interface ToastProps {
  message: string
}

function Toast({ message }: ToastProps) {
  return (
    <div className="toast">
      <div className="toast-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
          <path d="M8 12.5L10.7 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="toast-content">
        <p className="toast-label">Success</p>
        <p className="toast-message">{message}</p>
      </div>
    </div>
  )
}

export default Toast

