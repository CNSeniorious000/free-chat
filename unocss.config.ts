import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

import { presetHeroPatterns } from '@julr/unocss-preset-heropatterns'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({ scale: 1.1 }),
    presetTypography({ cssExtend: { 'ul,ol': { 'padding-left': '2.25em', 'position': 'relative' } } }),
    presetHeroPatterns(),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  shortcuts: {
    'fc': 'flex justify-center',
    'fi': 'flex items-center',
    'fb': 'flex justify-between',
    'fcc': 'fc items-center',
    'fie': 'fi justify-end',
    'col-fcc': 'flex-col fcc',
    'inline-fcc': 'inline-flex items-center justify-center',
    'base-focus': 'focus:(bg-op-20 ring-0 outline-none)',
    'b-slate-link': 'border-b border-($c-fg-70 none) hover:border-dashed',
    'gpt-title': 'text-2xl font-extrabold',
    'gpt-subtitle': 'text-(2xl transparent) font-extrabold bg-(clip-text gradient-to-r) from-sky-400 to-emerald-600',
    'gpt-copy-btn': 'absolute top-12px right-12px z-3 fcc border b-transparent w-fit min-w-8 h-8 p-2 bg-light-300 dark:bg-dark-300 op-90 cursor-pointer',
    'gpt-copy-tips': 'op-0 h-7 bg-black px-2.5 py-1 box-border text-xs c-white fcc rounded absolute z-1 transition duration-600 whitespace-nowrap -top-8',
    'gpt-retry-btn': 'fi gap-1 px-2 py-0.5 op-70 border border-$c-fg-50 rounded-md text-sm cursor-pointer hover:bg-$c-fg-5',
    'gpt-back-top-btn': 'fcc p-2.5 text-base rounded-md hover:bg-$c-fg-5 fixed bottom-60px right-20px z-10 cursor-pointer transition-colors',
    'gpt-back-bottom-btn': 'gpt-back-top-btn bottom-20px transform-rotate-180deg',
    'gpt-password-input': 'px-4 py-3 h-12 rounded-sm bg-(slate op-15) base-focus',
    'gpt-password-submit': 'fcc h-12 w-12 bg-slate cursor-pointer bg-op-20 hover:bg-op-50',
    'gen-slate-btn': 'h-12 px-4 py-2 bg-$c-fg-10 hover:bg-$c-fg-15 rounded-sm',
    'gen-cb-wrapper': 'h-12 my-4 fcc gap-4 bg-$c-fg-10 rounded-sm',
    'gen-cb-stop': 'px-2 py-0.5 border border-$c-fg-50 rounded-md text-sm op-70 cursor-pointer hover:bg-$c-fg-5',
    'gen-text-wrapper': 'my-4 fc gap-2 transition-opacity',
    'gen-textarea': 'w-full px-3 py-3 min-h-12 max-h-36 rounded-sm bg-$c-fg-10 resize-none focus:(bg-$c-fg-15 ring-0 outline-none) placeholder:op-50 dark:(placeholder:op-30) scroll-pa-8px',
    'sys-edit-btn': 'inline-fcc gap-1 text-sm bg-$c-fg-10 px-2 py-1 rounded-md transition-colors cursor-pointer hover:bg-$c-fg-15',
    'stick-btn-on': 'text-$c-bg !bg-$c-fg hover:!bg-$c-fg-80',
  },
})
