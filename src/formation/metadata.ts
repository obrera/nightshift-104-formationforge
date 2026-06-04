import { archetypeById, columnLabels, rowLabels } from './archetypes'
import { formationName } from './scoring'
import type { FormationBoard, FormationControls, FormationMetadata, FormationScores } from './types'

const escapeXml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

export function createFormationSvg(board: FormationBoard, scores: FormationScores, controls: FormationControls) {
  const cells = board
    .map((id, index) => {
      const x = 76 + (index % 3) * 148
      const y = 104 + Math.floor(index / 3) * 118
      const archetype = id ? archetypeById.get(id) : null
      const fill = archetype?.tint ?? '#1e2630'
      const label = archetype?.sigil ?? '--'
      return `
        <rect x="${x}" y="${y}" width="116" height="86" rx="12" fill="${fill}" fill-opacity="${archetype ? '0.26' : '0.10'}" stroke="${fill}" stroke-width="2"/>
        <text x="${x + 58}" y="${y + 48}" fill="#f8fafc" font-family="Inter, Arial" font-size="26" font-weight="800" text-anchor="middle">${escapeXml(label)}</text>
        <text x="${x + 58}" y="${y + 68}" fill="#aeb7c6" font-family="Inter, Arial" font-size="11" text-anchor="middle">${escapeXml(rowLabels[Math.floor(index / 3)])}.${escapeXml(columnLabels[index % 3])}</text>`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop stop-color="#080b10"/>
        <stop offset="0.55" stop-color="#121720"/>
        <stop offset="1" stop-color="#20120f"/>
      </linearGradient>
    </defs>
    <rect width="640" height="640" fill="url(#bg)"/>
    <rect x="42" y="58" width="556" height="424" rx="24" fill="#0f141c" stroke="#314052"/>
    <text x="64" y="44" fill="#f8fafc" font-family="Inter, Arial" font-size="24" font-weight="800">FormationForge</text>
    <text x="424" y="44" fill="#f4c95d" font-family="Inter, Arial" font-size="13" text-anchor="end">${escapeXml(controls.pressure)}</text>
    ${cells}
    <rect x="42" y="506" width="556" height="82" rx="18" fill="#111821" stroke="#293544"/>
    <text x="66" y="540" fill="#8bd3ff" font-family="Inter, Arial" font-size="15">readiness ${scores.readiness}</text>
    <text x="66" y="568" fill="#66d19e" font-family="Inter, Arial" font-size="15">front ${scores.frontlineIntegrity}</text>
    <text x="250" y="568" fill="#ff8fb7" font-family="Inter, Arial" font-size="15">burst ${scores.burstTempo}</text>
    <text x="430" y="568" fill="#f4c95d" font-family="Inter, Arial" font-size="15">rarity ${scores.rarity}</text>
  </svg>`
}

export function svgDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function metadataDataUri(metadata: FormationMetadata) {
  return `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(metadata))}`
}

export function createFormationMetadata(
  board: FormationBoard,
  controls: FormationControls,
  scores: FormationScores,
): FormationMetadata {
  const svg = createFormationSvg(board, scores, controls)
  const slots = board.map((id, index) => {
    const archetype = id ? archetypeById.get(id) : null
    return `${rowLabels[Math.floor(index / 3)]}-${columnLabels[index % 3]}:${archetype?.name ?? 'empty'}`
  })

  return {
    attributes: [
      { trait_type: 'Stance', value: controls.stance },
      { trait_type: 'Terrain', value: controls.terrain },
      { trait_type: 'Encounter Pressure', value: controls.pressure },
      { trait_type: 'Frontline Integrity', value: scores.frontlineIntegrity },
      { trait_type: 'Flank Risk', value: scores.flankRisk },
      { trait_type: 'Burst Tempo', value: scores.burstTempo },
      { trait_type: 'Support Coverage', value: scores.supportCoverage },
      { trait_type: 'Readiness', value: scores.readiness },
      { trait_type: 'Rarity', value: scores.rarity },
    ],
    description: 'A wallet-signed MPL Core devnet formation asset composed in FormationForge.',
    external_url: 'https://formationforge104.colmena.dev',
    image: svgDataUri(svg),
    name: formationName(scores, controls),
    properties: {
      board: slots,
      build: 104,
      controls,
      minted_on: '2026-06-04',
      product: 'FormationForge',
    },
  }
}
