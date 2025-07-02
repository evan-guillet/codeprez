// Importation des modules nécessaires d'Electron pour le preload
const { contextBridge, ipcRenderer } = require('electron')

// Expose un objet "electronAPI" dans la fenêtre globale du renderer (frontend)
// Cela permet au code frontend d'appeler ces fonctions sans avoir accès direct à Node.js
contextBridge.exposeInMainWorld('electronAPI', {
  // Demande au main process d'ouvrir une archive .codeprez et retourne le résultat (promesse)
  openCodePrez: (filePath) => ipcRenderer.invoke('open-codeprez', filePath),
  // Demande au main process de créer une archive .codeprez à partir de données fournies
  createCodePrez: (data) => ipcRenderer.invoke('create-codeprez', data),
  // Demande au main process d'exécuter une commande système (ex: terminal)
  runCommand: (commandObj) => ipcRenderer.invoke('run-command', commandObj),
  // Permet d'écouter les sorties de la commande exécutée (stdout/stderr)
  onCommandOutput: (callback) => ipcRenderer.on('command-output', (event, data) => callback(data))
})

// Message dans la console pour indiquer que le preload est chargé
console.log('Preload chargé')
