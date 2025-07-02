#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { extractCodeprezArchive } from '../utils/extract.js'

// ==== Recréer __dirname en ES Module ====
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// ==== Lecture et nettoyage de l’argument ====
let archiveArg = process.argv[2] || ''
archiveArg = archiveArg.replace(/^['"]|['"]$/g, '').replace(/[\/\\]$/, '')

if (!archiveArg) {
  console.error('❌ Usage : node testextract.mjs <chemin_archive.codeprez>')
  process.exit(1)
}

const archivePath = path.resolve(__dirname, archiveArg)
if (!fs.existsSync(archivePath)) {
  console.error('❌ Fichier introuvable :', archivePath)
  process.exit(1)
}

// ==== Prépare un dossier tmp local pour visualiser ====
const baseTemp = path.join(__dirname, 'tmp_test')
if (!fs.existsSync(baseTemp)) {
  await fs.promises.mkdir(baseTemp, { recursive: true })
}

// ==== Exécution de l’extraction ====
try {
  const tempDir = await extractCodeprezArchive(archivePath, baseTemp)
  console.log('✅ Archive extraite dans :', tempDir)
  const contents = await fs.promises.readdir(tempDir)
  console.log('📂 Contenu extrait :', contents)
} catch (err) {
  console.error('❌ Erreur d’extraction :', err.message)
}
