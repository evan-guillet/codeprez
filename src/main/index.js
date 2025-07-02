import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

import { createCodePrez } from '../utils/archiver.js'
import { unzipCodePrez } from '../utils/unzipper.js'
import { parseMarkdownToSlides } from '../utils/markdown.js'

// Recréer __dirname en ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow
let tempDir

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', async () => {
  if (tempDir) await fs.rm(tempDir, { recursive: true, force: true })
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('create-codeprez', async (event, data) => {
  try {
    await createCodePrez(data)
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
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
