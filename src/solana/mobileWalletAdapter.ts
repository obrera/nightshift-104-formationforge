import {
  createDefaultAuthorizationCache,
  createDefaultChainSelector,
  createDefaultWalletNotFoundHandler,
  registerMwa,
} from '@solana-mobile/wallet-standard-mobile'
import type { SolanaCluster } from '@wallet-ui/react'

export function registerMobileWalletAdapter(clusters: SolanaCluster[]) {
  if (typeof window === 'undefined' || !window.isSecureContext || !clusters.length) {
    return
  }

  registerMwa({
    appIdentity: { name: 'FormationForge', uri: 'https://formationforge104.colmena.dev' },
    authorizationCache: createDefaultAuthorizationCache(),
    chains: clusters.map((cluster) => cluster.id),
    chainSelector: createDefaultChainSelector(),
    onWalletNotFound: createDefaultWalletNotFoundHandler(),
  })
}
