import { useState } from 'react'

interface WalletState {
  address?: string
  isConnected: boolean
  isConnecting: boolean
  error?: string
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
  })

  const connect = async () => {
    setState(prev => ({ ...prev, isConnecting: true, error: undefined }))
    
    try {
      console.log('Starting wallet connection...')
      
      // Wait for wallet extension to be available (poll for up to 1 second)
      let connectorAPI = (window as any).midnight?.mnLace
      let attempts = 0
      const maxAttempts = 10
      
      while (!connectorAPI && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100))
        connectorAPI = (window as any).midnight?.mnLace
        attempts++
      }
      
      if (!connectorAPI) {
        console.error('Wallet connector API not found')
        throw new Error('Midnight Lace wallet not found. Please install the extension.')
      }

      console.log('Wallet connector API found, checking if enabled...')

      // Check if wallet is enabled (with timeout)
      let isEnabled: boolean
      try {
        isEnabled = await Promise.race([
          connectorAPI.isEnabled(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('isEnabled timeout')), 5000))
        ])
        console.log('Wallet enabled status:', isEnabled)
      } catch (err) {
        console.error('Error checking if wallet is enabled:', err)
        throw new Error('Wallet extension is not responding. Please make sure it is installed and enabled.')
      }

      // Enable wallet
      console.log('Enabling wallet...')
      let wallet: any
      try {
        wallet = await Promise.race([
          connectorAPI.enable(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('enable timeout')), 5000))
        ])
        console.log('Wallet enabled successfully')
      } catch (err) {
        console.error('Error enabling wallet:', err)
        throw new Error('Failed to enable wallet. Please approve the connection in the wallet extension.')
      }
      
      // Get wallet state - try direct await first (like midnight-kitties does)
      console.log('Getting wallet state...')
      let walletState: any
      try {
        // First, try to await directly (as midnight-kitties does)
        const stateResult = wallet.state()
        console.log('State result type:', typeof stateResult)
        console.log('Is Observable?', typeof stateResult?.subscribe === 'function')
        console.log('Is Promise?', typeof stateResult?.then === 'function')
        
        // Try direct await first (most common case)
        if (stateResult && typeof stateResult.then === 'function') {
          console.log('Awaiting as Promise...')
          walletState = await Promise.race([
            stateResult,
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('State timeout')), 15000))
          ])
        } else if (stateResult && typeof stateResult.subscribe === 'function') {
          // It's an Observable - need to subscribe and get first value
          console.log('Subscribing to Observable...')
          walletState = await new Promise((resolve, reject) => {
            let resolved = false
            let timeoutId: NodeJS.Timeout
            
            const subscription = stateResult.subscribe({
              next: (value: any) => {
                console.log('Observable emitted:', value)
                if (!resolved) {
                  resolved = true
                  clearTimeout(timeoutId)
                  subscription.unsubscribe()
                  resolve(value)
                }
              },
              error: (err: any) => {
                console.error('Observable error:', err)
                if (!resolved) {
                  resolved = true
                  clearTimeout(timeoutId)
                  subscription.unsubscribe()
                  reject(err)
                }
              },
              complete: () => {
                console.log('Observable completed')
              }
            })
            
            // Timeout after 15 seconds
            timeoutId = setTimeout(() => {
              if (!resolved) {
                resolved = true
                subscription.unsubscribe()
                reject(new Error('State timeout - Observable did not emit within 15 seconds'))
              }
            }, 15000)
          })
        } else {
          // Try to await it anyway
          console.log('Trying direct await...')
          walletState = await Promise.race([
            Promise.resolve(stateResult),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('State timeout')), 15000))
          ])
        }
        
        console.log('Wallet state retrieved:', walletState)
      } catch (err) {
        console.error('Error getting wallet state:', err)
        throw new Error('Failed to get wallet state. Please try again.')
      }
      
      if (!walletState || !walletState.address) {
        throw new Error('Invalid wallet state received')
      }
      
      setState({
        address: walletState.address,
        isConnected: true,
        isConnecting: false,
      })
      console.log('Wallet connected successfully, address:', walletState.address)
    } catch (error) {
      console.error('Wallet connection error:', error)
      setState({
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
      })
    }
  }

  return { ...state, connect }
}

