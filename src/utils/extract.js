// src/utils/unzipper.js
import fs from 'fs'
import path from 'path'
import os from 'os'
import unzipper from 'unzipper'

/**
 * Extrait une archive .codeprez (zip) dans un dossier temporaire.
 * @param {string} zipFilePath       Chemin vers l’archive .codeprez
 * @param {string} [baseTempDir]     Racine pour la temp (par défaut os.tmpdir())
 * @returns {Promise<string>}        Chemin du dossier d’extraction
 */
export async function extractCodeprezArchive(zipFilePath, baseTempDir = os.tmpdir()) {
  const tempDir = path.join(baseTempDir, `codeprez-${Date.now()}`)
  await fs.promises.mkdir(tempDir, { recursive: true })

  return new Promise((resolve, reject) => {
    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: tempDir }))
      .on('close', () => resolve(tempDir))
      .on('error', reject)
  })
}
