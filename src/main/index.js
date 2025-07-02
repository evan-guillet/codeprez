// Importation des modules nécessaires d'Electron et Node.js
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path, { join } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

// Importation des utilitaires internes pour décompresser et parser les présentations
import { unzipCodePrez } from '../utils/unzipper.js'
import { parseMarkdownToSlides } from '../utils/markdown.js'

// Détection du mode développement (utile pour le hot reload, devtools, etc.)
const is = { dev: process.env.NODE_ENV === 'development' }
// Placeholder pour la gestion des raccourcis clavier (ex: F12 pour devtools)
const optimizer = {
  watchWindowShortcuts: () => {}
}

// Recréation de __dirname en ES module (car non disponible nativement)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Définition du chemin de l'icône de l'application
const icon = path.join(__dirname, '../../resources/icon.png')

// Déclaration des variables globales pour la fenêtre principale et le dossier temporaire
let mainWindow
let tempDir

// Fonction qui crée la fenêtre principale de l'application
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,  // La fenêtre ne s'affiche qu'une fois prête
    autoHideMenuBar: true,
    icon,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: true,
      webSecurity: true,
      enableRemoteModule: false,  // Désactive le module remote (obsolète)
      contextIsolation: true, // Sépare le contexte du renderer et du preload
      nodeIntegration: false  // Désactive Node.js dans le renderer
    }
  })

  // Affiche la fenêtre uniquement quand elle est prête
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Ouvre les liens externes dans le navigateur par défaut
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' } // Empêche l'ouverture dans une nouvelle fenêtre Electron
  })

  // En mode développement, charge l'URL du serveur de dev (ex: Vite)
  // En production, charge le fichier HTML local
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Quand l'application est prête
app.whenReady().then(() => {
  // Définit l'ID du modèle utilisateur (important pour les notifications sur Windows)
  app.setAppUserModelId('com.electron')

  // Ajoute la gestion des raccourcis clavier à chaque nouvelle fenêtre
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Nettoie le dossier temporaire à la fermeture de toutes les fenêtres
  app.on('window-all-closed', async () => {
    if (tempDir) await fs.rm(tempDir, { recursive: true, force: true })
    if (process.platform !== 'darwin') app.quit()
  })

  // Handler IPC pour ouvrir une archive .codeprez
  ipcMain.handle('open-codeprez', async (event, filePath) => {
    try {
      // Décompresse l'archive dans un dossier temporaire
      tempDir = await unzipCodePrez(filePath)
      // Lit la configuration et le markdown de la présentation
      const configRaw = await fs.readFile(path.join(tempDir, 'config.json'), 'utf8')
      const mdRaw = await fs.readFile(path.join(tempDir, 'presentation.md'), 'utf8')
      // Parse le markdown en slides HTML
      const slides = parseMarkdownToSlides(mdRaw, configRaw, tempDir)
      // Retourne le résultat au renderer
      return { success: true, slides, config: JSON.parse(configRaw), tempDir }
    } catch (e) {
      // En cas d'erreur, retourne l'erreur au renderer
      return { success: false, error: e.message }
    }
  })

  // Test IPC simple (ping/pong)
  ipcMain.on('ping', () => console.log('pong'))

  // Crée la fenêtre principale
  createWindow()

  // Sur macOS, recrée une fenêtre si l'utilisateur clique sur l'icône du dock
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Gestion de la fermeture de toutes les fenêtres (hors macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
