<script lang="ts">
  import { onMount } from 'svelte'
  import { ripple } from 'svelte-ripple-action'
  import { trackEvent } from '@/utils/track'

  let themeToggle: HTMLButtonElement

  export let dark: boolean | undefined

  onMount(() => {
    const themeColorTag = document.querySelector('meta[name="theme-color"]')
    const iframes = document.querySelectorAll('iframe')
    const classList = document.documentElement.classList

    const postDarkMode = (darkMode: boolean) => {
      iframes.forEach(iframe => iframe.contentWindow?.postMessage({ darkMode }, '*'))
    }

    window.addEventListener('message', () => postDarkMode(Boolean(dark)))

    const chooseDarkMode = (isDark: boolean) => {
      dark = isDark
      dark ? classList.add('dark') : classList.remove('dark')
      themeColorTag?.setAttribute('content', dark ? '#212129' : '#fbfbfb')
      postDarkMode(!!dark)
      document.cookie = `dark=${dark}; path=/; max-age=31536000`
    }

    const colorSchema = window.matchMedia('(prefers-color-scheme: dark)')
    colorSchema.addEventListener('change', ({ matches }) => { chooseDarkMode(matches) })

    themeToggle.addEventListener('click', () => {
      chooseDarkMode(!dark)
      trackEvent('toggle-theme', { theme: dark ? 'dark' : 'light' })
    })

    chooseDarkMode(classList.contains('dark'))
  })

  $: r = dark ? 9 : 5
</script>

<button use:ripple={{ color: 'var(--c-fg-10)', maxRadius: 60 }} bind:this={themeToggle} id="themeToggle" class="h-10 w-10 flex items-center justify-center rounded-md transition-colors hover:bg-$c-fg-2">
  <svg class="theme_toggle_svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" color="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor">
    <mask id="myMask">
      <rect x="0" y="0" width="100%" height="100%" fill="white" />
      <circle {r} class="theme_toggle_circle1" fill="black" cx="100%" cy="0%" />
    </mask>
    <circle {r} class="theme_toggle_circle2" cx="12" cy="12" fill="currentColor" mask="url(#myMask)" />
    <g class="theme_toggle_g" stroke="currentColor" opacity="1">
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </g>
  </svg>
</button>

<style>
  #themeToggle {
    border: 0;
    cursor: pointer;
  }
  .theme_toggle_circle1 {
    transition: cx 0.5s, cy 0.5s;
    cx: 100%;
    cy: 0%;
  }
  .theme_toggle_circle2 {
    transition: r 0.3s;
  }
  .theme_toggle_svg {
    transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    transform: rotate(90deg);
  }
  .theme_toggle_g {
    transition: opacity 0.5s;
    opacity: 1;
  }
  :global(html.dark) #themeToggle .theme_toggle_circle1 {
    cx: 50%;
    cy: 23%;
  }
  :global(html.dark) #themeToggle .theme_toggle_svg {
    transform: rotate(40deg);
  }
  :global(html.dark) #themeToggle .theme_toggle_g {
    opacity: 0;
  }
</style>
