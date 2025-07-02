<script>
export default {
  props: ['htmlSlides', 'config', 'tempDir'],
  data() {
    return {
      currentIndex: 0,
      slides: [],
    }
  },
  computed: {
    currentSlide() {
      return this.slides[this.currentIndex] || ''
    },
  },
  mounted() {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = this.htmlSlides
    this.slides = Array.from(tempDiv.querySelectorAll('section')).map((s) => s.outerHTML)
    this.$refs.container.focus()
    document.documentElement.requestFullscreen()
  },
  methods: {
    nextSlide() {
      if (this.currentIndex < this.slides.length - 1) {
        this.currentIndex++
      } else {
        document.exitFullscreen()
        alert('Fin de la présentation')
      }
    },
    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },
  },
}
</script>

<template>
  <div
    @keydown.left.prevent="prevSlide"
    @keydown.right.prevent="nextSlide"
    tabindex="0"
    ref="container"
    style="height: 100vh; outline:none; padding:20px; overflow-y:auto;"
  >
    <div v-html="currentSlide"></div>
  </div>
</template>
