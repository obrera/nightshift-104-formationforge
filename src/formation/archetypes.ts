import type { Archetype, ArchetypeId, FormationBoard, FormationControls } from './types'

export const archetypes: Archetype[] = [
  {
    id: 'vanguard',
    name: 'Vanguard',
    sigil: 'VG',
    role: 'anchor',
    tint: '#ff6b4a',
    stats: { burst: 22, flank: 12, frontline: 44, rarity: 18, support: 8 },
  },
  {
    id: 'duelist',
    name: 'Duelist',
    sigil: 'DL',
    role: 'breaker',
    tint: '#f4c95d',
    stats: { burst: 40, flank: 18, frontline: 18, rarity: 22, support: 4 },
  },
  {
    id: 'warden',
    name: 'Warden',
    sigil: 'WD',
    role: 'guard',
    tint: '#66d19e',
    stats: { burst: 10, flank: 34, frontline: 32, rarity: 20, support: 20 },
  },
  {
    id: 'oracle',
    name: 'Oracle',
    sigil: 'OR',
    role: 'support',
    tint: '#8bd3ff',
    stats: { burst: 12, flank: 14, frontline: 6, rarity: 34, support: 46 },
  },
  {
    id: 'artillerist',
    name: 'Artillerist',
    sigil: 'AR',
    role: 'tempo',
    tint: '#ff8fb7',
    stats: { burst: 46, flank: 6, frontline: 4, rarity: 30, support: 16 },
  },
  {
    id: 'shade',
    name: 'Shade',
    sigil: 'SH',
    role: 'flanker',
    tint: '#b9a7ff',
    stats: { burst: 28, flank: 42, frontline: 8, rarity: 40, support: 10 },
  },
]

export const archetypeById = new Map<ArchetypeId, Archetype>(archetypes.map((archetype) => [archetype.id, archetype]))

export const defaultBoard: FormationBoard = [
  'warden',
  'vanguard',
  'duelist',
  'shade',
  'oracle',
  null,
  'artillerist',
  null,
  'warden',
]

export const defaultControls: FormationControls = {
  pressure: 'boss',
  stance: 'hold',
  terrain: 'ruins',
}

export const rowLabels = ['front', 'mid', 'rear']
export const columnLabels = ['left', 'center', 'right']
