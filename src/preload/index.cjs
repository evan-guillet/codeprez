// src/preload/preload.cjs
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  /* dossier → archive .codeprez  */
  pack: (src, dest) => ipcRenderer.invoke('pack', src, dest),
  /* fichier .codeprez → extraction */
  unpack: (file) => ipcRenderer.invoke('unpack', file),
  /* parse markdown */
  parse: (folder) => ipcRenderer.invoke('parse', folder),
  /* run cmd */
  runCommand: (payload) => ipcRenderer.invoke('run-command', payload),

  /* === nouvelles méthodes de dialogue === */
  chooseFolder: () => ipcRenderer.invoke('dialog:choose-folder'),
  chooseFile: () => ipcRenderer.invoke('dialog:choose-file'),

  /* stream stdout/stderr */
  onCommandOutput: (cb) => ipcRenderer.on('command-output', (_e, d) => cb(d))
})
