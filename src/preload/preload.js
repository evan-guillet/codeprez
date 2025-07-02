const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openCodePrez: (filePath) => ipcRenderer.invoke('open-codeprez', filePath),
  createCodePrez: (data) => ipcRenderer.invoke('create-codeprez', data),
  runCommand: (commandObj) => ipcRenderer.invoke('run-command', commandObj),
  onCommandOutput: (callback) => ipcRenderer.on('command-output', (event, data) => callback(data))
})
console.log('Preload chargé')
