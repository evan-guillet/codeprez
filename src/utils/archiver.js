// src/utils/archiver.js
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

/**
 * Crée une archive .codeprez (zip).
 * @param {string} sourceFolder  Dossier racine de la présentation
 * @param {string} outputFile    Chemin vers le .codeprez de sortie
 */
export function createCodeprezArchive(sourceFolder, outputFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFile)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => resolve())
    archive.on('error', (err) => reject(err))

    archive.pipe(output)

    const oblig = ['presentation.md', 'style.css', 'config.json']
    for (const f of oblig) {
      const p = path.join(sourceFolder, f)
      if (!fs.existsSync(p)) return reject(new Error(`Fichier manquant: ${f}`))
      archive.file(p, { name: f })
    }
    for (const d of ['assets', 'env']) {
      const dp = path.join(sourceFolder, d)
      if (fs.existsSync(dp)) archive.directory(dp, d)
    }
    archive.finalize()
  })
}
