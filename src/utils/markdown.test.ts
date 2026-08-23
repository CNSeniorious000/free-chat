/// <reference types="bun" />

import { describe, expect, test } from 'bun:test'

import { createMarkdownIt } from './markdown'

describe('CJK Markdown delimiters', () => {
  const markdown = createMarkdownIt()

  test('parses strong emphasis next to CJK text', () => {
    expect(markdown.renderInline('**该星号应该加粗。**这是后续文字。')).toBe('<strong>该星号应该加粗。</strong>这是后续文字。')
  })

  test('parses strikethrough next to CJK text', () => {
    expect(markdown.renderInline('~~删除的文字（带括号）。~~这是后续文字。')).toBe('<s>删除的文字（带括号）。</s>这是后续文字。')
  })
})
