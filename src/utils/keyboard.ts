// Prefer isComposing, with Process/229 fallbacks for IME edge cases: https://developer.mozilla.org/docs/Web/API/KeyboardEvent/isComposing
export function isImeComposing(event: KeyboardEvent) {
  return event.isComposing || event.key === 'Process' || event.keyCode === 229
}
