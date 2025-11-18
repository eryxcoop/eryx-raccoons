import { useWallet } from '../hooks/useWallet'
import './WalletButton.css'

function WalletButton() {
  const { address, isConnected, isConnecting, connect, error } = useWallet()

  if (isConnected && address) {
    return (
      <div className="wallet-address">
        {address.slice(0, 6)}...{address.slice(-4)}
      </div>
    )
  }

  return (
    <div className="wallet-button-wrapper">
      <button 
        className="wallet-button" 
        onClick={connect}
        disabled={isConnecting}
        title={error || undefined}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && (
        <div className="wallet-error" title={error}>
          ⚠
        </div>
      )}
    </div>
  )
}

export default WalletButton

