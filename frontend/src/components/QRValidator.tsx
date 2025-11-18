import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import './QRValidator.css'

interface QRData {
  merkleTreeRoot?: string
  merklePaths?: {
    name?: string[]
    email?: string[]
    documentNumber?: string[]
    birthDate?: string[]
  }
}

function QRValidator() {
  const [isScanning, setIsScanning] = useState(false)
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const qrCodeRef = useRef<Html5Qrcode | null>(null)
  const scannerId = useRef<string>(`qr-reader-${Date.now()}`)

  useEffect(() => {
    return () => {
      // Cleanup: stop scanning when component unmounts
      if (qrCodeRef.current && isScanning) {
        qrCodeRef.current.stop().catch(() => {
          // Ignore errors during cleanup
        })
      }
    }
  }, [isScanning])

  const startScanning = async () => {
    try {
      setValidationResult(null)
      setErrorMessage('')
      setIsScanning(true)

      const qrCode = new Html5Qrcode(scannerId.current)
      qrCodeRef.current = qrCode

      await qrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          handleQRCodeScanned(decodedText)
        },
        () => {
          // Ignore scanning errors, just keep scanning
        }
      )
    } catch (err) {
      console.error('Error starting QR scanner:', err)
      setErrorMessage('Failed to start camera. Please check permissions.')
      setIsScanning(false)
    }
  }

  const stopScanning = async () => {
    if (qrCodeRef.current) {
      try {
        await qrCodeRef.current.stop()
        await qrCodeRef.current.clear()
      } catch (err) {
        console.error('Error stopping QR scanner:', err)
      }
      qrCodeRef.current = null
    }
    setIsScanning(false)
    setValidationResult(null)
    setErrorMessage('')
  }

  const handleQRCodeScanned = async (decodedText: string) => {
    try {
      // Stop scanning once we get a result
      await stopScanning()

      // Parse the QR code data
      const qrData: QRData = JSON.parse(decodedText)

      // Validate: QR must have merklePaths and merkleTreeRoot
      if (!qrData.merklePaths || !qrData.merkleTreeRoot) {
        setValidationResult('error')
        setErrorMessage('Invalid QR code: Missing merklePaths or merkleTreeRoot')
        return
      }

      // Validate: fail if "name" is in merkle paths just for testing purposes
      const hasName = 'name' in qrData.merklePaths && qrData.merklePaths.name
      
      if (hasName) {
        setValidationResult('error')
        setErrorMessage('Invalid ticket')
        return
      }

      // If validation passes (no name in paths)
      setValidationResult('success')
    } catch (err) {
      console.error('Error parsing QR code:', err)
      setValidationResult('error')
      setErrorMessage('Invalid QR code format')
    }
  }

  return (
    <div className="qr-validator">
      <h1 className="title">QR Code Validation</h1>
      <p className="subtitle">Scan a ticket QR code to validate</p>

      <div className="scanner-container">
        <div id={scannerId.current} className="scanner"></div>
      </div>

      {!isScanning && !validationResult && (
        <button
          onClick={startScanning}
          className="button button-primary"
        >
          Start Scanning
        </button>
      )}

      {isScanning && (
        <button
          onClick={stopScanning}
          className="button button-secondary"
        >
          Stop Scanning
        </button>
      )}

      {validationResult === 'success' && (
        <div className="validation-result success">
          <div className="result-icon">✓</div>
          <h2 className="result-title">Validation Successful</h2>
          <p className="result-message">The ticket is valid</p>
          <button
            onClick={() => {
              setValidationResult(null)
              setErrorMessage('')
            }}
            className="button button-primary"
          >
            Scan Another
          </button>
        </div>
      )}

      {validationResult === 'error' && (
        <div className="validation-result error">
          <div className="result-icon">✗</div>
          <h2 className="result-title">Validation Failed</h2>
          <p className="result-message">{errorMessage || 'The ticket is invalid'}</p>
          <button
            onClick={() => {
              setValidationResult(null)
              setErrorMessage('')
            }}
            className="button button-primary"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default QRValidator

