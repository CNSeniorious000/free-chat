export function splitReasoningPart(message: string): [string, string] {
  if ('<think>\n'.startsWith(message)) {
    return ['', '']
  } else if (message.trimStart().startsWith('<think>\n')) {
    if (message.includes('</think>')) {
      const match = /<think>\n(.*?)\n<\/think>(.*)/s.exec(message)
      return match ? [match[1].trim(), match[2].trim()] : ['', message.trim()]
    } else {
      return [message.replace(/^\n?<think>\n/, '')
        .replace(/\n<\/think>/, '')
        .replace(/\n<\/think/, '')
        .replace(/\n<\/thin/, '')
        .replace(/\n<\/thi/, '')
        .replace(/\n<\/th/, '')
        .replace(/\n<\/t/, '')
        .replace(/\n<\//, '')
        .replace(/\n</, '')
        .trim(), '']
    }
  } else {
    return ['', message]
  }
}
