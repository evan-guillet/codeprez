<template>
  <div class="p-8 space-y-6">
    <h1 class="text-3xl font-bold">🎤 CodePrez Interface</h1>

    <!-- Actions -->
    <button @click="pack" class="btn">📦 Créer une archive</button>
    <button @click="unpack" class="btn">🪄 Extraire une archive</button>
    <button @click="parseSlides" class="btn">📑 Afficher les slides</button>
    <button @click="runEnvCommand" class="btn">⚙️ Lancer env/start.sh</button>

    <!-- Slides -->
    <div v-if="slides.length" class="mt-4">
      <h2 class="text-xl font-semibold">Slides :</h2>
      <ul class="list-disc pl-4">
        <li v-for="(slide, i) in slides" :key="i" v-html="slide"></li>
      </ul>
    </div>

    <!-- Sortie commande -->
    <div v-if="commandOutput.length" class="mt-4">
      <h2 class="text-xl font-semibold">Résultat commande :</h2>
      <pre>{{ commandOutput }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// ---- helpers ----
const API = window.electronAPI // <— alias pratique
if (!API) console.error('electronAPI non chargé !')

const slides = ref([])
const commandOutput = ref('')
const tempDir = ref('')

// 1. Créer une archive
async function pack() {
  if (!API?.chooseFolder) return alert('Preload pas chargé')
  const folder = await API.chooseFolder()
  if (!folder) return
  const out = `${folder}.codeprez`
  const res = await API.pack(folder, out)
  alert(res.success ? '✅ Archive créée' : `❌ ${res.error}`)
}

// 2. Extraire une archive
async function unpack() {
  if (!API?.chooseFile) return alert('Preload pas chargé')
  const file = await API.chooseFile()
  if (!file) return
  const res = await API.unpack(file)
  if (res.success) {
    tempDir.value = res.tempDir
    alert('✅ Archive extraite')
  } else {
    alert(`❌ ${res.error}`)
  }
}

// 3. Parser le Markdown en slides
async function parseSlides() {
  if (!tempDir.value) return alert('Dossier temporaire non chargé')
  const res = await API.parse(tempDir.value)
  if (res.success) slides.value = res.slides
  else alert(`❌ ${res.error}`)
}

// 4. Lancer la commande dans env
async function runEnvCommand() {
  if (!tempDir.value) return alert('Dossier temporaire non chargé')
  commandOutput.value = ''
  await API.runCommand({ command: 'sh env/start.sh', tempDir: tempDir.value })
}

// réception stdout/stderr en temps réel
onMounted(() => {
  API?.onCommandOutput?.((data) => {
    commandOutput.value += data
  })
})
</script>

<style scoped>
.btn {
  background-color: #4f46e5;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s;
  display: inline-block;
}
.btn:hover {
  background-color: #4338ca;
}
</style>
