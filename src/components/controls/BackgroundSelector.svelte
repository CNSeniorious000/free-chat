<script lang="ts">
  import { persistedState } from 'svelte-persisted-state'

  import { ripple } from '../../utils/ripple'

  function asIs(value: 'endless' | 'classic') {
    return value
  }

  const pattern = persistedState<'endless' | 'classic'>('pattern', 'endless', {
    beforeWrite: (value) => {
      document.dispatchEvent(new CustomEvent('localStorageSet', {
        detail: { key: 'pattern', value: String(value) },
      }))
      return value
    },
    serializer: { stringify: asIs, parse: asIs },
  })
</script>

<div class="flex flex-row gap-1.5">
  <button use:ripple={{ color: 'var(--c-fg-15)' }} class:active={pattern.current === 'classic'} onclick={() => pattern.current = 'classic'}>
    <div role="presentation" class="bg-hero-topography-gray-500/15"></div>
    <div role="group">
      <h4>Topography</h4>
      <h5>Free Chat Classic</h5>
    </div>
  </button>

  <button use:ripple={{ color: 'var(--c-fg-15)' }} class:active={pattern.current === 'endless'} onclick={() => pattern.current = 'endless'}>
    <div role="presentation" class="bg-hero-jigsaw-gray-500/10"></div>
    <div role="group">
      <h4>Jigsaw</h4>
      <h5>Endless Chat Default</h5>
    </div>
  </button>
</div>

<style>
  button {
    --uno: relative flex-1 cursor-default rounded bg-$c-fg-5 p-1.5 outline-none transition duration-50 active:scale-98;
  }

  button.active, button:focus-visible, button:hover {
    --uno: ring-(inset 1.2);
  }

  button.active {
    --uno: bg-transparent ring-$c-fg-40;
  }

  button:hover {
    --uno: bg-transparent;
  }

  button:hover, button:focus-visible {
    --uno: ring-$c-fg;
  }

  [role="presentation"] {
    --uno: absolute size-200% scale-70 rounded bg-top-center transition duration-1000 -left-50% -top-50%;
    background-position-y: 50%;
  }

  :global([data-state="closed"]) [role="presentation"] {
    --uno: scale-90 op-30 delay-1000 ease-out;
  }

  [role="group"] {
    --uno: relative h-20 flex flex-col justify-center;
  }

  h4 {
    --uno: rounded-sm text-xs tracking-widest font-mono uppercase op-50;
  }

  h5 {
    --uno: text-3.1 line-height-1.8em -translate-y-0.5;
  }
</style>
