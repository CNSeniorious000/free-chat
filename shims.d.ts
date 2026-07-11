import type NumberFlow from 'number-flow'
import type { AttributifyAttributes } from 'unocss/preset-attributify'

// UnoCSS attributify: valueless shorthands like `op-30` / `i-xxx` aren't covered by
// AttributifyAttributes (it only types prefix-style attrs), so allow arbitrary keys too.
interface UnoAttributify extends AttributifyAttributes {
  [key: string]: unknown
}

declare module 'svelte/elements' {
  interface HTMLAttributes<T extends EventTarget> extends UnoAttributify {}
}

declare namespace JSX {
  interface HTMLAttributes extends UnoAttributify {}
}

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'number-flow': NumberFlow & HTMLAttributes
    }
  }
}
