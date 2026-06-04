import { archetypeById } from './archetypes'
import type { FormationBoard, FormationControls, FormationScores } from './types'

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

export function scoreFormation(board: FormationBoard, controls: FormationControls): FormationScores {
  const filled = board.flatMap((id) => (id ? [archetypeById.get(id)!] : []))
  const total = filled.length || 1
  const rows = [board.slice(0, 3), board.slice(3, 6), board.slice(6, 9)]
  const columns = [0, 1, 2].map((index) => [board[index], board[index + 3], board[index + 6]])

  const base = filled.reduce(
    (acc, archetype) => ({
      burst: acc.burst + archetype.stats.burst,
      flank: acc.flank + archetype.stats.flank,
      frontline: acc.frontline + archetype.stats.frontline,
      rarity: acc.rarity + archetype.stats.rarity,
      support: acc.support + archetype.stats.support,
    }),
    { burst: 0, flank: 0, frontline: 0, rarity: 0, support: 0 },
  )

  const frontPresence = rows[0].filter(Boolean).length
  const rearPresence = rows[2].filter(Boolean).length
  const centerColumn = columns[1].filter(Boolean).length
  const sideColumns = columns[0].filter(Boolean).length + columns[2].filter(Boolean).length
  const duplicatePenalty = filled.length - new Set(filled.map((item) => item.id)).size

  const stance = {
    hold: { burst: -4, flank: -8, frontline: 12, support: 5 },
    surge: { burst: 15, flank: 10, frontline: -6, support: -2 },
    veil: { burst: 4, flank: -14, frontline: -2, support: 12 },
  }[controls.stance]

  const terrain = {
    foundry: { burst: 10, flank: 3, frontline: 7, support: -6 },
    reef: { burst: -2, flank: -10, frontline: 3, support: 9 },
    ruins: { burst: 4, flank: 1, frontline: 8, support: 2 },
    skyline: { burst: 8, flank: 12, frontline: -8, support: 5 },
  }[controls.terrain]

  const pressure = {
    ambush: { burst: 5, flank: 18, frontline: -2, support: 3 },
    boss: { burst: 8, flank: 5, frontline: 12, support: 8 },
    siege: { burst: -2, flank: -4, frontline: 18, support: 6 },
    swarm: { burst: 14, flank: 12, frontline: 4, support: -2 },
  }[controls.pressure]

  const frontlineIntegrity = clampScore(base.frontline / total + frontPresence * 9 + centerColumn * 5 + stance.frontline + terrain.frontline + pressure.frontline)
  const supportCoverage = clampScore(base.support / total + rearPresence * 8 + stance.support + terrain.support + pressure.support - duplicatePenalty * 4)
  const burstTempo = clampScore(base.burst / total + sideColumns * 4 + stance.burst + terrain.burst + pressure.burst)
  const flankRisk = clampScore(100 - (base.flank / total + sideColumns * 6 + stance.flank + terrain.flank - pressure.flank))
  const rarity = clampScore(base.rarity / total + filled.length * 4 + new Set(filled.map((item) => item.role)).size * 5 - duplicatePenalty * 3)
  const readiness = clampScore((frontlineIntegrity + supportCoverage + burstTempo + (100 - flankRisk) + rarity) / 5)

  return { burstTempo, flankRisk, frontlineIntegrity, rarity, readiness, supportCoverage }
}

export function formationName(scores: FormationScores, controls: FormationControls) {
  const grade = scores.rarity > 82 ? 'Mythic' : scores.rarity > 68 ? 'Prime' : scores.rarity > 52 ? 'Rare' : 'Field'
  return `${grade} ${controls.terrain} ${controls.stance} formation`
}
