import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

import Router from './Router'

export default function SimpleMarkdown(props: { text: string }) {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkBreaks).use(remarkMath)
  return <Router node={processor.parse(props.text)} />
}
