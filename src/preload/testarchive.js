const path = require('path')
const { createCodeprezArchive } = require('./createarchive')

const dossierSource = process.argv[2]
if (!dossierSource) {
  console.error('❌ Tu dois fournir un dossier source en argument !')
  process.exit(1)
}

const dossierAbsolu = path.resolve(dossierSource)
const dossierArchives = path.join(__dirname, 'archives')
const destination = path.join(dossierArchives, 'output.codeprez')

// Crée dossier archives s’il n’existe pas
const fs = require('fs')
if (!fs.existsSync(dossierArchives)) {
  fs.mkdirSync(dossierArchives)
}

// Lance la création de l’archive
createCodeprezArchive(dossierAbsolu, destination)
  .then(() => console.log('✅ Archive créée dans le dossier archives !'))
  .catch((err) => console.error('❌ Erreur :', err.message))
