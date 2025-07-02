#!/usr/bin/env node
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { extractCodeprezArchive } from '../utils/extract.js'
import { runCommand } from '../utils/runner.js'

// ==== __dirname pour ESM ====
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let archiveArg = process.argv[2] || ''
archiveArg = archiveArg.replace(/^['"]|['"]$/g, '').replace(/[\/\\]$/, '')

if (!archiveArg) {
  console.error('❌ Usage : node testrunner.mjs <chemin_archive.codeprez>')
  process.exit(1)
}

const archivePath = path.resolve(__dirname, archiveArg)
if (!fs.existsSync(archivePath)) {
  console.error('❌ Fichier introuvable :', archivePath)
  process.exit(1)
}

// 1) Extrait l’archive dans tmp
const tmp = await extractCodeprezArchive(archivePath, path.join(__dirname, 'tmp_runner'))

// 2) Appelle runCommand (par exemple `node --version`)
console.log('🚀 Lancement de la commande `node --version` dans', path.join(tmp, 'env'))
try {
  const { code, output } = await runCommand('node --version', tmp, (data) => {
    process.stdout.write(data)
  })
  console.log('\n✅ Commande terminée avec code', code)
} catch (e) {
  console.error('❌ Erreur runCommand:', e)
}
