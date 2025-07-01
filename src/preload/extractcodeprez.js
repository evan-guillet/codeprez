const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')
const { app } = require('electron')

function extractCodeprezArchive(codeprezPath) {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(app.getPath('temp'), 'codeprez-' + Date.now())
    fs.mkdirSync(tempDir, { recursive: true })

    fs.createReadStream(codeprezPath)
      .pipe(unzipper.Extract({ path: tempDir }))
      .on('close', () => {
        console.log(` Archive extraite dans : ${tempDir}`)
        resolve(tempDir)
      })
      .on('error', (err) => reject(err))
  })
}

module.exports = { extractCodeprezArchive }
