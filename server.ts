const port = Number(process.env.PORT ?? 3000)
const dist = `${import.meta.dir}/dist`

import { createFormationMetadata, createFormationSvg } from './src/formation/metadata'
import { scoreFormation } from './src/formation/scoring'
import { decodeFormationState } from './src/formation/stateCodec'

Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/metadata/')) {
      const encoded = url.pathname.split('/').at(-1)
      const { board, controls } = decodeFormationState(encoded)
      const scores = scoreFormation(board, controls)
      const metadata = createFormationMetadata(board, controls, scores)
      metadata.image = `${url.origin}/api/svg/${encoded ?? ''}`

      return Response.json(metadata, {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
        },
      })
    }

    if (url.pathname.startsWith('/api/svg/')) {
      const encoded = url.pathname.split('/').at(-1)
      const { board, controls } = decodeFormationState(encoded)
      const scores = scoreFormation(board, controls)

      return new Response(createFormationSvg(board, scores, controls), {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
          'content-type': 'image/svg+xml; charset=utf-8',
        },
      })
    }

    const pathname = url.pathname === '/' ? '/index.html' : url.pathname
    const file = Bun.file(`${dist}${pathname}`)

    if (await file.exists()) {
      return new Response(file)
    }

    return new Response(Bun.file(`${dist}/index.html`))
  },
})

console.log(`FormationForge serving on ${port}`)
