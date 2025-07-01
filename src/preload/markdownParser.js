const fs = require('fs')
const path = require('path')
const MarkdownIt = require('markdown-it')
const hljs = require('highlight.js')

const md = new MarkdownIt({
  html: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch {
        // fallback
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

async function parsePresentationMarkdown(dossierPresentation) {
  const mdPath = path.join(dossierPresentation, 'presentation.md')
  const configPath = path.join(dossierPresentation, 'config.json')

  if (!fs.existsSync(mdPath)) throw new Error('presentation.md introuvable')
  if (!fs.existsSync(configPath)) throw new Error('config.json introuvable')

  const markdownRaw = fs.readFileSync(mdPath, 'utf-8')
  const configRaw = fs.readFileSync(configPath, 'utf-8')

  let config
  try {
    config = JSON.parse(configRaw)
  } catch {
    throw new Error('config.json mal formé')
  }

  const slidesRaw = markdownRaw.split(/\n{2}---\n{2}/)

  const introSlideMd =
    `# ${config.title || 'Présentation'}\n\n` +
    `**Présentateurs:** ${Array.isArray(config.presenters) ? config.presenters.join(', ') : ''}\n\n` +
    `**Durée estimée:** ${config.duration || 'non précisée'} minutes`

  slidesRaw.unshift(introSlideMd)

  const slidesHTML = slidesRaw.map(md.render.bind(md)).map((html) => `<section>${html}</section>`)

  return slidesHTML
}

module.exports = { parsePresentationMarkdown }
