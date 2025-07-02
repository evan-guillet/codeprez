// src/utils/markdown.js
import fs from 'fs'
import path from 'path'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const md = new MarkdownIt({
  html: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

/**
 * Parse le Markdown en tableau de sections HTML.
 * @param {string} folder Dossier où se trouvent presentation.md + config.json
 * @returns {string[]}    Array de <section>…</section>
 */
export function parsePresentationMarkdown(folder) {
  const mdPath = path.join(folder, 'presentation.md')
  const cfgPath = path.join(folder, 'config.json')
  if (!fs.existsSync(mdPath)) throw new Error('presentation.md introuvable')
  if (!fs.existsSync(cfgPath)) throw new Error('config.json introuvable')

  const rawMd = fs.readFileSync(mdPath, 'utf-8')
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'))

  const segments = rawMd.split(/\n---\n/)

  const intro =
    `# ${cfg.title || ''}\n\n` +
    `**Présentateurs**: ${Array.isArray(cfg.presenters) ? cfg.presenters.join(', ') : ''}\n\n` +
    `**Durée**: ${cfg.duration || 'non précisée'} minutes`

  segments.unshift(intro)

  return segments.map((segment) => `<section>${md.render(segment)}</section>`)
}
