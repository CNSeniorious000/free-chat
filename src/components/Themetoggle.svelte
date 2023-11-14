<div bind:this={themeToggle} id="themeToggle" class="h-10 w-10 flex items-center justify-center rounded-md transition-colors hover:bg-$c-fg-5">
  <svg class="theme_toggle_svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" color="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor">
    <mask id="myMask">
      <rect x="0" y="0" width="100%" height="100%" fill="white" />
      <circle bind:this={themeCircle1} class="theme_toggle_circle1" fill="black" cx="100%" cy="0%" />
    </mask>
    <circle bind:this={themeCircle2} class="theme_toggle_circle2" cx="12" cy="12" fill="currentColor" mask="url(#myMask)" />
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
</div>

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

<script lang="ts">
  import { onMount } from 'svelte'

  let themeToggle: HTMLDivElement, themeCircle1: SVGElement, themeCircle2: SVGElement

  onMount(() => {
    const themeColorTag = document.querySelector('meta[name="theme-color"]')
    const iframes = document.querySelectorAll('iframe')
    const classList = document.documentElement.classList

    const postDarkMode = (darkMode: boolean) => {
      iframes.forEach(iframe => iframe.contentWindow?.postMessage({ darkMode }, '*'))
    }

    window.addEventListener('message', () => postDarkMode(classList.contains('dark') ?? localStorage.getItem('theme') === 'dark'))

    const toggleThemeCircle = () => {
      const darkMode = classList.contains('dark') || localStorage.getItem('theme') === 'dark'
      if (darkMode) {
        themeCircle1.setAttribute('r', '9')
        themeCircle2.setAttribute('r', '9')
        themeColorTag?.setAttribute('content', '#212129')
      } else {
        themeCircle1.setAttribute('r', '5')
        themeCircle2.setAttribute('r', '5')
        themeColorTag?.setAttribute('content', '#fbfbfb')
      }
      postDarkMode(darkMode)
    }

    const colorSchema = window.matchMedia('(prefers-color-scheme: dark)')

    const chooseDarkMode = () => {
      classList.toggle('dark', colorSchema.matches)
      toggleThemeCircle()
    }

    const theme = localStorage.getItem('theme')
    classList.toggle('dark', theme ? theme === 'dark' : colorSchema.matches)
    toggleThemeCircle()

    colorSchema.addEventListener('change', chooseDarkMode)

    const handleToggleClick = () => {
      classList.toggle('dark')
      const isDark = classList.contains('dark')
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
      toggleThemeCircle()
    }
    themeToggle.addEventListener('click', handleToggleClick)
  })
</script>
