import { defaultBoard, defaultControls } from './archetypes'
import type { EncodedFormationState, FormationBoard, FormationControls, Pressure, Stance, Terrain } from './types'

const archetypeCodes = {
  artillerist: 'a',
  duelist: 'd',
  oracle: 'o',
  shade: 's',
  vanguard: 'v',
  warden: 'w',
} as const

const codeToArchetype = Object.fromEntries(
  Object.entries(archetypeCodes).map(([id, code]) => [code, id]),
) as Record<string, NonNullable<FormationBoard[number]>>

const stanceCodes: Record<Stance, string> = { hold: 'h', surge: 's', veil: 'v' }
const terrainCodes: Record<Terrain, string> = { foundry: 'f', reef: 'r', ruins: 'u', skyline: 's' }
const pressureCodes: Record<Pressure, string> = { ambush: 'a', boss: 'b', siege: 's', swarm: 'w' }

const invert = <T extends string>(value: Record<T, string>) =>
  Object.fromEntries(Object.entries(value).map(([key, code]) => [code, key])) as Record<string, T>

const codeToStance = invert(stanceCodes)
const codeToTerrain = invert(terrainCodes)
const codeToPressure = invert(pressureCodes)

export function encodeFormationState(
  board: FormationBoard,
  controls: FormationControls,
): EncodedFormationState {
  const slots = board.map((slot) => (slot ? archetypeCodes[slot] : 'x')).join('')
  return `${slots}.${stanceCodes[controls.stance]}${terrainCodes[controls.terrain]}${pressureCodes[controls.pressure]}`
}

export function decodeFormationState(encoded: string | undefined): {
  board: FormationBoard
  controls: FormationControls
} {
  if (!encoded) {
    return { board: defaultBoard, controls: defaultControls }
  }

  const [slots = '', flags = ''] = encoded.split('.')
  if (slots.length !== 9 || flags.length !== 3) {
    return { board: defaultBoard, controls: defaultControls }
  }

  const board = slots.split('').map((code) => (code === 'x' ? null : (codeToArchetype[code] ?? null)))
  const stance = codeToStance[flags[0]] ?? defaultControls.stance
  const terrain = codeToTerrain[flags[1]] ?? defaultControls.terrain
  const pressure = codeToPressure[flags[2]] ?? defaultControls.pressure

  return { board, controls: { pressure, stance, terrain } }
}
