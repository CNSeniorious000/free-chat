declare namespace svelteHTML {
  import type { AttributifyAttributes } from 'unocss/preset-attributify'
  type HTMLAttributes = AttributifyAttributes
}

declare namespace global {
  namespace JSX {
    import type { AttributifyAttributes } from 'unocss/preset-attributify'
    interface HTMLAttributes<>extends AttributifyAttributes {}
  }
}
