export type ArchetypeId = 'vanguard' | 'duelist' | 'warden' | 'oracle' | 'artillerist' | 'shade'
export type Stance = 'hold' | 'surge' | 'veil'
export type Terrain = 'ruins' | 'reef' | 'skyline' | 'foundry'
export type Pressure = 'ambush' | 'siege' | 'boss' | 'swarm'

export interface Archetype {
  id: ArchetypeId
  name: string
  sigil: string
  role: string
  tint: string
  stats: {
    frontline: number
    flank: number
    burst: number
    support: number
    rarity: number
  }
}

export type BoardSlot = ArchetypeId | null
export type FormationBoard = BoardSlot[]

export interface FormationControls {
  pressure: Pressure
  stance: Stance
  terrain: Terrain
}

export interface FormationScores {
  burstTempo: number
  flankRisk: number
  frontlineIntegrity: number
  rarity: number
  readiness: number
  supportCoverage: number
}

export interface FormationMetadata {
  attributes: { trait_type: string; value: number | string }[]
  description: string
  external_url: string
  image: string
  name: string
  properties: {
    board: string[]
    build: number
    controls: FormationControls
    minted_on: string
    product: string
  }
}

export type EncodedFormationState = string
