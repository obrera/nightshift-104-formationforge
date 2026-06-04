import { Activity, BadgeCheck, Cuboid, Dices, Shield, Sparkles, Sword, Target } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useWalletUi, type UiWalletAccount } from '@wallet-ui/react'

import { archetypeById, archetypes, columnLabels, defaultBoard, defaultControls, rowLabels } from '../formation/archetypes'
import { createFormationMetadata } from '../formation/metadata'
import { formationName, scoreFormation } from '../formation/scoring'
import { encodeFormationState } from '../formation/stateCodec'
import type { ArchetypeId, BoardSlot, FormationBoard, FormationControls, FormationScores } from '../formation/types'
import { SolanaProvider } from '../solana/SolanaProvider'
import { WalletButton } from '../solana/WalletButton'
import { useFormationMint, type FormationMintReceipt } from '../solana/useFormationMint'
import { useSolanaClient } from '../solana/useSolanaClient'

export function App() {
  return (
    <SolanaProvider>
      <ForgeScreen />
    </SolanaProvider>
  )
}

function ForgeScreen() {
  const [board, setBoard] = useState<FormationBoard>(defaultBoard)
  const [selected, setSelected] = useState<ArchetypeId>('vanguard')
  const [controls, setControls] = useState<FormationControls>(defaultControls)
  const [receipt, setReceipt] = useState<FormationMintReceipt | null>(null)
  const [mintError, setMintError] = useState<string | null>(null)
  const { account, cluster, connected } = useWalletUi()
  const scores = useMemo(() => scoreFormation(board, controls), [board, controls])
  const metadata = useMemo(() => createFormationMetadata(board, controls, scores), [board, controls, scores])
  const mintMetadataUri = useMemo(() => {
    const origin = typeof window === 'undefined' ? 'https://formationforge104.colmena.dev' : window.location.origin
    return `${origin}/api/metadata/${encodeFormationState(board, controls)}`
  }, [board, controls])

  function place(index: number) {
    setBoard((current) => current.map((value, slot) => (slot === index ? selected : value)))
    setReceipt(null)
  }

  function clear(index: number) {
    setBoard((current) => current.map((value, slot) => (slot === index ? null : value)))
    setReceipt(null)
  }

  function updateControl<K extends keyof FormationControls>(key: K, value: FormationControls[K]) {
    setControls((current) => ({ ...current, [key]: value }))
    setReceipt(null)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">devnet core squad forge</p>
          <h1>FormationForge</h1>
        </div>
        <div className="topbar-actions">
          <span className="cluster-pill">{cluster.label}</span>
          <WalletButton />
        </div>
      </header>

      <section className="forge-grid">
        <section className="panel board-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">battle lattice</p>
              <h2>{formationName(scores, controls)}</h2>
            </div>
            <button className="ghost-button" onClick={() => setBoard(defaultBoard)} type="button">
              Reset
            </button>
          </div>

          <div className="formation-board" aria-label="3 by 3 squad formation board">
            {board.map((slot, index) => (
              <BoardCell key={index} index={index} onClear={() => clear(index)} onPlace={() => place(index)} slot={slot} />
            ))}
          </div>
        </section>

        <aside className="panel palette-panel">
          <div className="panel-heading compact">
            <div>
              <p className="eyebrow">party archetype</p>
              <h2>{archetypeById.get(selected)?.name}</h2>
            </div>
          </div>
          <div className="archetype-list">
            {archetypes.map((archetype) => (
              <button
                className={selected === archetype.id ? 'archetype-card active' : 'archetype-card'}
                key={archetype.id}
                onClick={() => setSelected(archetype.id)}
                style={{ '--tint': archetype.tint } as React.CSSProperties}
                type="button"
              >
                <span className="sigil">{archetype.sigil}</span>
                <span>
                  <strong>{archetype.name}</strong>
                  <small>{archetype.role}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="panel controls-panel">
          <div className="panel-heading compact">
            <div>
              <p className="eyebrow">encounter tuning</p>
              <h2>Pressure model</h2>
            </div>
          </div>
          <ControlGroup
            label="Stance"
            options={[
              ['hold', 'Hold'],
              ['surge', 'Surge'],
              ['veil', 'Veil'],
            ]}
            value={controls.stance}
            onChange={(value) => updateControl('stance', value)}
          />
          <ControlGroup
            label="Terrain"
            options={[
              ['ruins', 'Ruins'],
              ['reef', 'Reef'],
              ['skyline', 'Skyline'],
              ['foundry', 'Foundry'],
            ]}
            value={controls.terrain}
            onChange={(value) => updateControl('terrain', value)}
          />
          <ControlGroup
            label="Pressure"
            options={[
              ['boss', 'Boss'],
              ['ambush', 'Ambush'],
              ['siege', 'Siege'],
              ['swarm', 'Swarm'],
            ]}
            value={controls.pressure}
            onChange={(value) => updateControl('pressure', value)}
          />
        </section>

        <section className="panel stat-panel">
          <div className="panel-heading compact">
            <div>
              <p className="eyebrow">simulation</p>
              <h2>Formation stats</h2>
            </div>
            <Dices size={20} />
          </div>
          <Stats scores={scores} />
        </section>

        <section className="panel preview-panel">
          <div className="panel-heading compact">
            <div>
              <p className="eyebrow">first-party asset</p>
              <h2>JSON / SVG metadata</h2>
            </div>
            <Cuboid size={20} />
          </div>
          <div className="metadata-grid">
            <img alt="Formation SVG metadata preview" src={metadata.image} />
            <pre>{JSON.stringify(metadata, null, 2)}</pre>
          </div>
        </section>

        <section className="panel mint-panel">
          <div className="panel-heading compact">
            <div>
              <p className="eyebrow">wallet-signed mpl core</p>
              <h2>Mint and verify</h2>
            </div>
            <BadgeCheck size={20} />
          </div>
          {account ? (
            <MintControls
              account={account}
              metadataName={metadata.name}
              metadataUri={mintMetadataUri}
              onError={setMintError}
              onMinted={setReceipt}
            />
          ) : (
            <button className="primary-button muted" disabled type="button">
              Connect Wallet
            </button>
          )}
          <div className="receipt-box">
            <span className={connected ? 'status-dot ok' : 'status-dot'} />
            <span>{connected ? 'Wallet signer ready' : 'Wallet signer required'}</span>
            <span className="mono">{account?.address ?? 'no account'}</span>
          </div>
          {receipt ? (
            <div className="receipt-box success">
              <strong>Verified asset</strong>
              <span className="mono">asset {receipt.asset}</span>
              <span className="mono">signature {receipt.signature}</span>
            </div>
          ) : null}
          {mintError ? <div className="receipt-box danger">{mintError}</div> : null}
        </section>
      </section>
    </main>
  )
}

function BoardCell({
  index,
  onClear,
  onPlace,
  slot,
}: {
  index: number
  onClear: () => void
  onPlace: () => void
  slot: BoardSlot
}) {
  const archetype = slot ? archetypeById.get(slot) : null
  return (
    <button
      className={archetype ? 'board-cell filled' : 'board-cell'}
      onClick={onPlace}
      onContextMenu={(event) => {
        event.preventDefault()
        onClear()
      }}
      style={{ '--tint': archetype?.tint ?? '#556070' } as React.CSSProperties}
      type="button"
    >
      <span className="cell-zone">
        {rowLabels[Math.floor(index / 3)]}.{columnLabels[index % 3]}
      </span>
      <span className="cell-sigil">{archetype?.sigil ?? '+'}</span>
      <span className="cell-name">{archetype?.name ?? 'empty slot'}</span>
    </button>
  )
}

function ControlGroup<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string
  onChange: (value: T) => void
  options: [T, string][]
  value: T
}) {
  return (
    <label className="control-group">
      <span>{label}</span>
      <div>
        {options.map(([option, text]) => (
          <button className={value === option ? 'active' : ''} key={option} onClick={() => onChange(option)} type="button">
            {text}
          </button>
        ))}
      </div>
    </label>
  )
}

function Stats({ scores }: { scores: FormationScores }) {
  const stats = [
    ['Frontline', scores.frontlineIntegrity, Shield],
    ['Flank risk', scores.flankRisk, Target],
    ['Burst tempo', scores.burstTempo, Sword],
    ['Support', scores.supportCoverage, Activity],
    ['Rarity', scores.rarity, Sparkles],
    ['Readiness', scores.readiness, BadgeCheck],
  ] as const

  return (
    <div className="stats-list">
      {stats.map(([label, value, Icon]) => (
        <div className="stat-row" key={label}>
          <Icon size={17} />
          <span>{label}</span>
          <div className="stat-bar">
            <i style={{ width: `${value}%` }} />
          </div>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  )
}

function MintControls({
  account,
  metadataName,
  metadataUri,
  onError,
  onMinted,
}: {
  account: UiWalletAccount
  metadataName: string
  metadataUri: string
  onError: (error: string | null) => void
  onMinted: (receipt: FormationMintReceipt) => void
}) {
  const client = useSolanaClient()
  const { isMinting, mintFormation } = useFormationMint({ account, client })

  return (
    <button
      className="primary-button"
      disabled={isMinting}
      onClick={async () => {
        onError(null)
        try {
          onMinted(await mintFormation({ name: metadataName, uri: metadataUri }))
        } catch (error) {
          onError(error instanceof Error ? error.message : 'Mint failed before wallet confirmation.')
        }
      }}
      type="button"
    >
      {isMinting ? 'Minting Formation' : 'Mint Formation Asset'}
    </button>
  )
}
