/**
 * Borrowed from https://github.com/alephpiece via https://github.com/CherryHQ/cherry-studio/pull/7358 and https://github.com/CherryHQ/cherry-studio/pull/7582
 */

const containsLatexRegex = /\\\(.*?\\\)|\\\[.*?\\\]/s

const findLatexMatch = (text: string, openDelim: string, closeDelim: string) => {
  // Count consecutive backslashes to determine if a character is escaped
  // Odd count means the character is escaped, even count means it's not
  const escaped = (i: number) => {
    let count = 0
    while (--i >= 0 && text[i] === '\\') count++
    return count & 1
  }

  // Find the first valid opening delimiter
  for (let i = 0, n = text.length; i <= n - openDelim.length; i++) {
    // Skip if opening delimiter not found or if it's escaped
    if (!text.startsWith(openDelim, i) || escaped(i)) continue

    // Handle nested structures by tracking depth
    for (let j = i + openDelim.length, depth = 1; j <= n - closeDelim.length && depth; j++) {
      // Calculate depth change at current position: +1 for opening, -1 for closing, 0 otherwise
      const delta
        = text.startsWith(openDelim, j) && !escaped(j) ? 1 : text.startsWith(closeDelim, j) && !escaped(j) ? -1 : 0

      if (delta) {
        depth += delta

        // Found matching closing delimiter when depth reaches 0
        if (!depth)
          return {
            start: i,
            end: j + closeDelim.length,
            pre: text.slice(0, i),
            body: text.slice(i + openDelim.length, j),
            post: text.slice(j + closeDelim.length),
          }

        // Skip processed delimiter characters to avoid duplicate checks
        j += (delta > 0 ? openDelim : closeDelim).length - 1
      }
    }
  }

  return null
}

export const processLatexBrackets = (text: string) => {
  // Return original text if no LaTeX patterns are found
  if (!containsLatexRegex.test(text)) {
    return text
  }

  // Protect code blocks and links from LaTeX processing
  const protectedItems: string[] = []
  let processedContent = text

  processedContent = processedContent
    // Protect code blocks (including multiline and inline code)
    .replace(/(```[\s\S]*?```|`[^`]*`)/g, (match) => {
      const index = protectedItems.length
      protectedItems.push(match)
      return `__CHERRY_STUDIO_PROTECTED_${index}__`
    })
    // Protect links [text](url)
    .replace(/\[([^[\]]*(?:\[[^\]]*\][^[\]]*)*)\]\([^)]*\)/g, (match) => {
      const index = protectedItems.length
      protectedItems.push(match)
      return `__CHERRY_STUDIO_PROTECTED_${index}__`
    })

  // Process LaTeX delimiters and convert them to appropriate wrappers
  const processMath = (content: string, openDelim: string, closeDelim: string, wrapper: string): string => {
    let result = ''
    let remaining = content

    while (remaining.length > 0) {
      const match = findLatexMatch(remaining, openDelim, closeDelim)
      if (!match) {
        result += remaining
        break
      }
      result += match.pre
      result += `${wrapper}${match.body}${wrapper}`
      remaining = match.post
    }
    return result
  }

  let result = processMath(processedContent, '\\[', '\\]', '$$')
  result = processMath(result, '\\(', '\\)', '$')

  result = result.replace(/__CHERRY_STUDIO_PROTECTED_(\d+)__/g, (match, indexStr) => {
    const index = parseInt(indexStr, 10)
    if (index >= 0 && index < protectedItems.length) {
      return protectedItems[index]
    }
    return match
  })

  return result
}
