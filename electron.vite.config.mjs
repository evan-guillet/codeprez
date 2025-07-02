import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    vite: {
      build: {
        target: 'node16',
        sourcemap: true,
        rollupOptions: {
          external: [
            'unzipper',
            'adm-zip',
            'fs',
            'path',
            'electron',
            'child_process'
            // ajoute ici d'autres modules natifs que tu utilises côté main
          ]
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()]
  }
})
