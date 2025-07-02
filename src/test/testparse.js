import path from 'path'
import fs from 'fs'
import { parsePresentationMarkdown } from '../utils/markdown.js'

let folderArg = process.argv[2]
if (!folderArg) {
  console.error('❌ Usage : node testparse.mjs <dossier_extrait>')
  process.exit(1)
}
folderArg = folderArg.replace(/^['"]|['"]$/g, '').replace(/[\/\\]$/, '')

const presDir = path.resolve(folderArg)
if (!fs.existsSync(presDir)) {
  console.error('❌ Dossier introuvable :', presDir)
  process.exit(1)
}

try {
  const slides = await parsePresentationMarkdown(presDir)
  console.log('✅ Slides HTML générées :\n')
  slides.forEach((html, i) => {
    console.log(`--- Slide ${i} ---\n${html}\n`)
  })
} catch (err) {
  console.error('❌ Erreur parsing Markdown :', err.message)
}
