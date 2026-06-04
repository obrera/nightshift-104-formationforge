import { ChevronDown, Copy, LogOut, Wallet } from 'lucide-react'
import { useState } from 'react'
import { type UiWallet, ellipsify, useWalletUi, useWalletUiWallet, WalletUiIcon } from '@wallet-ui/react'

function sortWallets(wallets: readonly UiWallet[]) {
  return [...wallets].sort((left, right) => left.name.localeCompare(right.name))
}

export function WalletButton() {
  const [open, setOpen] = useState(false)
  const { account, connected, copy, disconnect, wallet, wallets } = useWalletUi()

  return (
    <div className="wallet-shell">
      <button className="wallet-trigger" onClick={() => setOpen((value) => !value)} type="button">
        {connected && wallet ? <WalletUiIcon className="wallet-icon" wallet={wallet} /> : <Wallet size={17} />}
        <span>{connected && account ? ellipsify(account.address) : 'Connect Wallet'}</span>
        <ChevronDown size={15} />
      </button>

      {open ? (
        <div className="wallet-popover">
          {connected ? (
            <>
              <button onClick={() => copy()} type="button">
                <Copy size={15} /> Copy address
              </button>
              <button onClick={() => disconnect()} type="button">
                <LogOut size={15} /> Disconnect
              </button>
            </>
          ) : null}
          <div className="wallet-list">
            {sortWallets(wallets).map((availableWallet) => (
              <WalletOption key={availableWallet.name} onConnected={() => setOpen(false)} wallet={availableWallet} />
            ))}
            {!wallets.length ? (
              <a href="https://solana.com/solana-wallets" rel="noreferrer" target="_blank">
                Install a Solana wallet
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function WalletOption({ onConnected, wallet }: { onConnected: () => void; wallet: UiWallet }) {
  const { connect } = useWalletUiWallet({ wallet })
  return (
    <button
      onClick={async () => {
        await connect()
        onConnected()
      }}
      type="button"
    >
      <WalletUiIcon className="wallet-icon" wallet={wallet} />
      {wallet.name}
    </button>
  )
}
