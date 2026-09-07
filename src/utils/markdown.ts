import MarkdownIt from 'markdown-it'
import markdownItCjkFriendly from 'markdown-it-cjk-friendly'

export const createMarkdownIt = (options: ConstructorParameters<typeof MarkdownIt>[0] = {}) => MarkdownIt(options).use(markdownItCjkFriendly)
