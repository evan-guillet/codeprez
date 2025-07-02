import fs from 'fs/promises'
import path from 'path'
import unzipper from 'unzipper'
import os from 'os'

export async function unzipCodePrez(zipFile, baseTempDir = os.tmpdir()) {
  const tempDir = path.join(baseTempDir, 'codeprez_' + Date.now())

  await fs.mkdir(tempDir, { recursive: true })

  await new Promise((resolve, reject) => {
    const stream = unzipper.Extract({ path: tempDir })
    fs.createReadStream(zipFile).pipe(stream).on('close', resolve).on('error', reject)
  })

  return tempDir
}
