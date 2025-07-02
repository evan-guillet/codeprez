<script setup>
import { ref } from 'vue'
import SelectPath from './components/SelectPath.vue'
import Presentation from './components/Presentation.vue'

const htmlSlides = ref('')
const config = ref(null)
const tempDir = ref('')
const presentationLoaded = ref(false)

function onStartPresentation(res) {
  if (res.success) {
    htmlSlides.value = res.slides
    config.value = res.config
    tempDir.value = res.tempDir
    presentationLoaded.value = true
  } else {
    alert('Erreur ouverture présentation: ' + res.error)
  }
}
</script>

<template>
  <SelectPath v-if="!presentationLoaded" @startPresentation="onStartPresentation" />
  <Presentation
    v-if="presentationLoaded"
    :htmlSlides="htmlSlides"
    :config="config"
    :tempDir="tempDir"
  />
</template>
