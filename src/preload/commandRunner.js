const { spawn } = require('child_process')

function runCommand(dossierEnv, cmd, args = [], onData = () => {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: dossierEnv, shell: true })

    child.stdout.on('data', (data) => onData({ type: 'stdout', data: data.toString() }))
    child.stderr.on('data', (data) => onData({ type: 'stderr', data: data.toString() }))

    child.on('error', reject)

    child.on('close', (code) => resolve(code))
  })
}

module.exports = { runCommand }
