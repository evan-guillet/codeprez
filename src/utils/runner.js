// src/utils/runner.js
import { spawn } from 'child_process'
import path from 'path'

/**
 * Exécute une commande dans le dossier env de la présentation.
 * @param {string} command  La commande à exécuter (shell)
 * @param {string} tempDir  Dossier racine extrait incluant /env
 * @param {function} onData Callback pour chaque chunk stdout/stderr
 * @returns {Promise<{code:number,output:string}>}
 */
export function runCommand(command, tempDir, onData = () => {}) {
  return new Promise((resolve, reject) => {
    const cwd = path.join(tempDir, 'env')
    const proc = spawn(command, { shell: true, cwd })

    let output = ''
    proc.stdout.on('data', (d) => {
      output += d
      onData(d.toString())
    })
    proc.stderr.on('data', (d) => {
      output += d
      onData(d.toString())
    })

    proc.on('close', (code) => resolve({ code, output }))
    proc.on('error', (err) => reject(err))
  })
}
