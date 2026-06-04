import {
  type ClusterUrl,
  createClient,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  type DevnetUrl,
} from '@solana/kit'

export type SolanaClient = ReturnType<typeof createSolanaClient>

interface ClientOptions<T extends ClusterUrl> {
  http: T
  ws?: T
}

export function createSolanaClient<T extends ClusterUrl = DevnetUrl>({ http, ws }: ClientOptions<T>) {
  if (!http.startsWith('http')) {
    throw new Error(`Invalid Solana RPC URL: ${http}`)
  }

  return createClient()
    .use((client) => ({ ...client, rpc: createSolanaRpc<T>(http) }))
    .use((client) => ({
      ...client,
      rpcSubscriptions: createSolanaRpcSubscriptions<T>((ws ?? http.replace('http', 'ws')) as T),
    }))
}
