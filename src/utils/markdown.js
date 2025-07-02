import { marked } from 'marked'

export function parseMarkdownToSlides(mdRaw, configRaw, tempDir) {
  // Simple parse en HTML via marked
  const html = marked.parse(mdRaw)

  // Suppose que chaque slide est une section HTML, on découpe en <section>
  // Ici on enveloppe tout dans une section unique pour simplifier
  return `<section>${html}</section>`
}
