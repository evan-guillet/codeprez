import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'

import { createCodeprezArchive } from '../utils/archiver.js'
import { extractCodeprezArchive } from '../utils/extract.js'
import { parsePresentationMarkdown } from '../utils/markdown.js'
import { runCommand } from '../utils/runner.js'

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/preload.cjs')
    }
  })
  // en dev on pointe sur le serveur Vite
  mainWindow.loadURL('http://localhost:5173')
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// ------------------------------------------------------------------
// IPC handlers
// ------------------------------------------------------------------
ipcMain.handle('dialog:choose-folder', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return canceled ? null : filePaths[0]
})

ipcMain.handle('dialog:choose-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'CodePrez', extensions: ['codeprez'] }]
  })
  return canceled ? null : filePaths[0]
})

ipcMain.handle('pack', (_e, src, dest) => tryWrap(() => createCodeprezArchive(src, dest)))
ipcMain.handle('unpack', (_e, archive) => tryWrap(() => extractCodeprezArchive(archive)))
ipcMain.handle('parse', (_e, folder) => tryWrap(() => parsePresentationMarkdown(folder)))
ipcMain.handle('run-command', (_e, { command, tempDir }) =>
  runCommand(command, tempDir, (data) => mainWindow.webContents.send('command-output', data))
)

// ------------------------------------------------------------------
function tryWrap(promiseFactory) {
  return promiseFactory()
    .then((r) => ({ success: true, ...r }))
    .catch((e) => ({ success: false, error: e.message }))
}
