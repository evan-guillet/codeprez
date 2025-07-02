// Script utilitaire pour générer une archive .codeprez à partir d'un dossier source
// Ce fichier n'est pas utilisé par l'application, il sert uniquement pour tester la création d'archives en local

const path = require('path')
const { createCodeprezArchive } = require('./createarchive')

// Récupère le dossier source passé en argument de la ligne de commande
const dossierSource = process.argv[2]
if (!dossierSource) {
  console.error('❌ Tu dois fournir un dossier source en argument !')
  process.exit(1)
}

// Résout le chemin absolu du dossier source et prépare les chemins de sortie
const dossierAbsolu = path.resolve(dossierSource)
const dossierArchives = path.join(__dirname, 'archives')
const destination = path.join(dossierArchives, 'output.codeprez')

// Crée le dossier "archives" s’il n’existe pas déjà
const fs = require('fs')
if (!fs.existsSync(dossierArchives)) {
  fs.mkdirSync(dossierArchives)
}

// Lance la création de l’archive .codeprez à partir du dossier source
createCodeprezArchive(dossierAbsolu, destination)
  .then(() => console.log('✅ Archive créée dans le dossier archives !'))
  .catch((err) => console.error('❌ Erreur :', err.message))
