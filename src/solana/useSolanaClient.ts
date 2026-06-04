import { useWalletUi } from '@wallet-ui/react'
import { useMemo } from 'react'

import { createSolanaClient } from './createSolanaClient'

export function useSolanaClient() {
  const { cluster } = useWalletUi()
  return useMemo(() => createSolanaClient({ http: cluster.url }), [cluster.url])
}
