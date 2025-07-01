<script setup>
import { ref } from 'vue'

const selectedPath = ref('')

async function selectFiles() {
  const options = {
    properties: ['openDirectory']
  }
  const paths = await window.api.openFileDialog(options)
  if (paths && paths[0]) {
    selectedPath.value = paths[0]
    window.api.sendFolderPath(paths[0])
  }
}
</script>

<template>
  <button @click="selectFiles">Ajouter une présentation</button>
  <span v-if="selectedPath" style="margin-left: 1em;">{{ selectedPath }}</span>
</template>
