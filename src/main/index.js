import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path, { join } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'


import { unzipCodePrez } from '../utils/unzipper.js'
import { parseMarkdownToSlides } from '../utils/markdown.js'

// Pour HMR/devtools si tu utilises electron-vite ou équivalent
const is = { dev: process.env.NODE_ENV === 'development' }
const optimizer = {
  watchWindowShortcuts: () => {}
}

// Recréer __dirname en ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Définir le chemin de l'icône
const icon = path.join(__dirname, '../../resources/icon.png')

let mainWindow
let tempDir

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'), // Utilise preload.js pour window.electronAPI
      sandbox: true,
      webSecurity: true,
      enableRemoteModule: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Set app user model id for windows
  app.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('window-all-closed', async () => {
    if (tempDir) await fs.rm(tempDir, { recursive: true, force: true })
    if (process.platform !== 'darwin') app.quit()
  })

  ipcMain.handle('open-codeprez', async (event, filePath) => {
    try {
      tempDir = await unzipCodePrez(filePath)
      const configRaw = await fs.readFile(path.join(tempDir, 'config.json'), 'utf8')
      const mdRaw = await fs.readFile(path.join(tempDir, 'presentation.md'), 'utf8')
      const slides = parseMarkdownToSlides(mdRaw, configRaw, tempDir)
      return { success: true, slides, config: JSON.parse(configRaw), tempDir }
    } catch (e) {
      return { success: false, error: e.message }
    }
  })

  ipcMain.on('folder:selected', (event, folderPath) => {
    console.log('Path selection :', folderPath)
    // TODO: Handle the selected folder path 'folderPath' and delete console.log
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
