<script setup>
import { ref } from 'vue'

const selectedFile = ref(null)
const emit = defineEmits(['startPresentation'])

function onFileChange(event) {
  const file = event.target.files[0]
  if (file) selectedFile.value = file
  else selectedFile.value = null
}

async function startPresentation() {
  if (!selectedFile.value) {
    alert('Choisissez un fichier .codeprez avant de commencer')
    return
  }
  const res = await window.electronAPI.openCodePrez(selectedFile.value.path)
  emit('startPresentation', res)
}
</script>

<template>
  <div>
    <h2>Ouvrir une présentation .codeprez</h2>
    <input type="file" @change="onFileChange" accept=".codeprez" />
    <button :disabled="!selectedFile" @click="startPresentation">
      Commencer la présentation
    </button>
  </div>
</template>
