import { contextBridge, ipcRenderer } from 'electron'

// Définition d'APIs personnalisées pour le renderer
const api = {
  // Ouvre une boîte de dialogue pour sélectionner un fichier (appel IPC vers le main)
  openFileDialog: (options) => ipcRenderer.invoke('dialog:openFile', options),
  // Envoie le chemin d'un dossier sélectionné au main process
  sendFolderPath: (folderPath) => ipcRenderer.send('folder:selected', folderPath)
}

// Utilise contextBridge pour exposer les APIs Electron au renderer
// uniquement si l'isolation de contexte est activée (plus sécurisé).
if (process.contextIsolated) {
  try {
    // Expose ipcRenderer dans la fenêtre globale sous "electron"
    contextBridge.exposeInMainWorld('electron', {
      ipcRenderer
    })
    // Expose les APIs personnalisées sous "api"
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    // Affiche une erreur en cas de problème lors de l'exposition
    console.error(error)
  }
} else {
  // Si l'isolation de contexte n'est pas activée, ajoute directement aux globals
  window.electron = { ipcRenderer }
  window.api = api
}
