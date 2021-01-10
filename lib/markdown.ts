import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

let markdown: MarkdownIt

export function getMarkdown() {
  if (markdown) return markdown
  markdown = MarkdownIt({
    html: false,
    highlight: (str, lang) => {
      try {
        const highlighted = hljs.highlight(lang, str)
        return highlighted.errorRaised ? '' : highlighted.value
      } catch {
        return ''
      }
    },
  })
  return markdown
}
