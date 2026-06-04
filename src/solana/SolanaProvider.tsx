import {
  createSolanaDevnet,
  createSolanaLocalnet,
  createWalletUiConfig,
  WalletUi,
} from '@wallet-ui/react'
import { type ReactNode, useEffect } from 'react'

import { registerMobileWalletAdapter } from './mobileWalletAdapter'

const config = createWalletUiConfig({
  clusters: [createSolanaDevnet('https://api.devnet.solana.com'), createSolanaLocalnet('http://127.0.0.1:8899')],
})

let mobileRegistered = false

export function SolanaProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (mobileRegistered) {
      return
    }
    mobileRegistered = true
    registerMobileWalletAdapter(config.clusters)
  }, [])

  return <WalletUi config={config}>{children}</WalletUi>
}
