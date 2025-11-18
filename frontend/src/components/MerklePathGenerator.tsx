import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { QRCodeSVG } from 'qrcode.react'
import './MerklePathGenerator.css'

interface MerkleTree {
  leaves: string[]
  nodes: string[]
}

interface ScannedQRData {
  merkleTree?: MerkleTree
  name?: string
  email?: string
  documentNumber?: string
  birthDate?: string
}

type SelectedField = 'name' | 'email' | 'documentNumber' | 'birthDate'

function MerklePathGenerator() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedMerkleTree, setScannedMerkleTree] = useState<MerkleTree | null>(null)
  const [merkleTreeRoot, setMerkleTreeRoot] = useState<string>('')
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([])
  const [generatedQR, setGeneratedQR] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const qrCodeRef = useRef<Html5Qrcode | null>(null)
  const scannerId = useRef<string>(`merkle-scanner-${Date.now()}`)
  const generatedQRRef = useRef<SVGSVGElement>(null)

  const availableFields: { key: SelectedField; label: string }[] = [
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'documentNumber', label: 'Document Number' },
    { key: 'birthDate', label: 'Birth Date' }
  ]

  useEffect(() => {
    return () => {
      if (qrCodeRef.current && isScanning) {
        qrCodeRef.current.stop().catch(() => {})
      }
    }
  }, [isScanning])

  const startScanning = async () => {
    try {
      setError('')
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
        (errorMessage) => {
          // Ignore scanning errors
        }
      )
    } catch (err) {
      console.error('Error starting QR scanner:', err)
      setError('Failed to start camera. Please check permissions.')
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
  }

  const handleQRCodeScanned = async (decodedText: string) => {
    try {
      await stopScanning()

      // Parse the QR data - can be just merkleTree or merkleTree + personal data
      const qrData: ScannedQRData | MerkleTree = JSON.parse(decodedText)

      let merkleTree: MerkleTree
      let root: string

      // Check if it's the new format with personal data
      if ('merkleTree' in qrData && qrData.merkleTree) {
        merkleTree = qrData.merkleTree
        // Generate merkleTreeRoot (in real scenario, this would be calculated from the tree)
        root = '0x' + Math.random().toString(16).substr(2, 64)
      } else {
        // Old format: just merkleTree
        merkleTree = qrData as MerkleTree
        // Generate merkleTreeRoot
        root = '0x' + Math.random().toString(16).substr(2, 64)
      }

      // Validate structure
      if (!merkleTree.leaves || !merkleTree.nodes || !Array.isArray(merkleTree.leaves) || !Array.isArray(merkleTree.nodes)) {
        setError('Invalid merkle tree format')
        return
      }

      setScannedMerkleTree(merkleTree)
      setMerkleTreeRoot(root)
      setError('')
    } catch (err) {
      console.error('Error parsing QR code:', err)
      setError('Invalid QR code format. Expected merkle tree JSON.')
    }
  }

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
    if (!scannedMerkleTree || selectedFields.length === 0) {
      setError('Please scan a QR code and select at least one field')
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
      merkleTreeRoot: merkleTreeRoot,
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

  const reset = () => {
    setScannedMerkleTree(null)
    setMerkleTreeRoot('')
    setSelectedFields([])
    setGeneratedQR(null)
    setError('')
  }

  return (
    <div className="merkle-path-generator">
      <h1 className="title">Generate Merkle Paths</h1>
      <p className="subtitle">Scan a QR code with merkle tree and select fields to generate paths</p>

      {!scannedMerkleTree && (
        <div className="scan-section">
          <div className="scanner-container">
            <div id={scannerId.current} className="scanner"></div>
          </div>

          {!isScanning && (
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
        </div>
      )}

      {scannedMerkleTree && !generatedQR && (
        <div className="selection-section">
          <h2 className="section-title">Select Fields</h2>
          <p className="section-subtitle">Choose which fields to generate merkle paths for</p>

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

          <button
            onClick={generateMerklePaths}
            disabled={selectedFields.length === 0}
            className="button button-primary"
          >
            Generate Merkle Paths
          </button>

          <button
            onClick={reset}
            className="button button-secondary"
          >
            Scan Another QR
          </button>
        </div>
      )}

      {generatedQR && (
        <div className="result-section">
          <h2 className="section-title">Generated QR Code</h2>
          <p className="section-subtitle">QR code with merkle paths for selected fields</p>

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
            Download QR Code
          </button>

          <button
            onClick={reset}
            className="button button-secondary"
          >
            Generate New
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

