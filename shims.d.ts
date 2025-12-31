import type NumberFlow from 'number-flow'

declare namespace svelteHTML {
  import type { AttributifyAttributes } from 'unocss/preset-attributify'

  type HTMLAttributes = AttributifyAttributes
}

declare namespace JSX {
  import type { AttributifyAttributes } from 'unocss/preset-attributify'

  interface HTMLAttributes extends AttributifyAttributes {}
}

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'number-flow': NumberFlow & HTMLAttributes
    }
  }
}
