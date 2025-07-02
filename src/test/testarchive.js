#!/usr/bin/env node
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { createCodeprezArchive } from '../utils/archiver.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const src = process.argv[2]
if (!src) {
  console.error('❌ Usage : node testarchive.mjs <dossier_presentation>')
  process.exit(1)
}

const dossierAbsolu = path.resolve(src)
const outDir = path.join(__dirname, 'archives')
const destination = path.join(outDir, 'output.codeprez')

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
  console.log('📁 Dossier archives créé :', outDir)
}

createCodeprezArchive(dossierAbsolu, destination)
  .then(() => console.log('✅ Archive créée dans :', destination))
  .catch((err) => console.error('❌ Erreur :', err.message))
