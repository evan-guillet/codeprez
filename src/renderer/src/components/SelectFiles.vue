<script setup>
import { ref } from 'vue'

const selectedPaths = ref([])

async function selectFiles() {
  const options = {
    properties: ['openFile', 'multiSelections']
  }
  const paths = await window.api.openFileDialog(options)
  selectedPaths.value = paths || []
}
</script>

<template>
  <button @click="selectFiles">Choisir fichiers/dossiers</button>
  <ul>
    <li v-for="path in selectedPaths" :key="path">{{ path }}</li>
  </ul>
</template>
