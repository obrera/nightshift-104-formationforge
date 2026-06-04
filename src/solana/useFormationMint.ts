import { getCreateV1Instruction } from '@obrera/mpl-core-kit-lib/generated'
import {
  address,
  appendTransactionMessageInstruction,
  assertIsTransactionMessageWithSingleSendingSigner,
  createTransactionMessage,
  generateKeyPairSigner,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
} from '@solana/kit'
import { type UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useState } from 'react'

import type { SolanaClient } from './createSolanaClient'

export interface FormationMintReceipt {
  asset: string
  owner: string
  signature: string
  uri: string
}

export function useFormationMint({ account, client }: { account: UiWalletAccount; client: SolanaClient }) {
  const transactionSigner = useWalletUiSigner({ account })
  const [isMinting, setIsMinting] = useState(false)

  async function mintFormation({ name, uri }: { name: string; uri: string }): Promise<FormationMintReceipt> {
    setIsMinting(true)
    try {
      const asset = await generateKeyPairSigner()
      const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
      const message = pipe(
        createTransactionMessage({ version: 0 }),
        (transactionMessage) => setTransactionMessageFeePayerSigner(transactionSigner, transactionMessage),
        (transactionMessage) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transactionMessage),
        (transactionMessage) =>
          appendTransactionMessageInstruction(
            getCreateV1Instruction({
              asset,
              authority: transactionSigner,
              name: name.slice(0, 32),
              owner: address(account.address),
              payer: transactionSigner,
              updateAuthority: transactionSigner.address,
              uri,
            }),
            transactionMessage,
          ),
      )

      assertIsTransactionMessageWithSingleSendingSigner(message)
      const signatureBytes = await signAndSendTransactionMessageWithSigners(message)

      return {
        asset: asset.address,
        owner: transactionSigner.address,
        signature: getBase58Decoder().decode(signatureBytes),
        uri,
      }
    } finally {
      setIsMinting(false)
    }
  }

  return { isMinting, mintFormation }
}
