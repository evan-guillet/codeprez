import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

export async function createCodePrez({ sourceFolder, outputFile }) {
  const markdownPath = path.join(sourceFolder, 'presentation.md')
  const cssPath = path.join(sourceFolder, 'style.css')
  const configPath = path.join(sourceFolder, 'config.json')
  const assetsDir = path.join(sourceFolder, 'assets')
  const envDir = path.join(sourceFolder, 'env')

  if (![markdownPath, cssPath, configPath].every(fs.existsSync)) {
    throw new Error('Fichiers obligatoires manquants')
  }

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFile)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', resolve)
    archive.on('error', reject)

    archive.pipe(output)
    archive.file(markdownPath, { name: 'presentation.md' })
    archive.file(cssPath, { name: 'style.css' })
    archive.file(configPath, { name: 'config.json' })
    if (fs.existsSync(assetsDir)) archive.directory(assetsDir, 'assets')
    if (fs.existsSync(envDir)) archive.directory(envDir, 'env')
    archive.finalize()
  })

  return outputFile
}
