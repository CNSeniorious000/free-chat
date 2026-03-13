import type { JSX, ParentProps } from 'solid-js'

import './FadedScrollViewport.css'

import { createEffect, createSignal, mergeProps, onCleanup, splitProps } from 'solid-js'

interface Props extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> {
  edgeFade?: number
  lenisPrevent?: boolean
  maxHeight?: string
  stickToBottom?: boolean
}

interface ViewportVars {
  '--fsv-mask-image': string
  '--fsv-max-height': string
}

export default (props: Props) => {
  const merged = mergeProps({
    edgeFade: 16,
    lenisPrevent: true,
    maxHeight: '11rem',
    stickToBottom: false,
  }, props)
  const [local, others] = splitProps(merged, [
    'children',
    'class',
    'edgeFade',
    'lenisPrevent',
    'maxHeight',
    'stickToBottom',
    'style',
  ])
  const [showTopFade, setShowTopFade] = createSignal(false)
  const [showBottomFade, setShowBottomFade] = createSignal(false)
  const [shouldStickToBottom, setShouldStickToBottom] = createSignal(true)

  let viewport!: HTMLDivElement
  let content!: HTMLDivElement
  let frame = 0

  const syncViewport = () => {
    const maxScroll = viewport.scrollHeight - viewport.clientHeight
    if (maxScroll <= 1) {
      setShowTopFade(false)
      setShowBottomFade(false)
      setShouldStickToBottom(true)
      return
    }

    const distanceToBottom = maxScroll - viewport.scrollTop
    setShowTopFade(viewport.scrollTop > 1)
    setShowBottomFade(distanceToBottom > 1)
    setShouldStickToBottom(distanceToBottom < 12)
  }

  const scheduleSync = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      if (local.stickToBottom && shouldStickToBottom())
        viewport.scrollTop = viewport.scrollHeight
      syncViewport()
    })
  }

  const maskImage = (): string => {
    const top = showTopFade()
      ? `transparent 0px, black ${local.edgeFade}px`
      : `black 0px, black ${local.edgeFade}px`
    const bottom = showBottomFade()
      ? `black calc(100% - ${local.edgeFade}px), transparent 100%`
      : `black calc(100% - ${local.edgeFade}px), black 100%`
    return `linear-gradient(180deg, ${top}, ${bottom})`
  }

  const vars = (): ViewportVars => ({
    '--fsv-mask-image': maskImage(),
    '--fsv-max-height': local.maxHeight,
  })

  const style = (): JSX.CSSProperties | string => {
    if (typeof local.style === 'string') {
      return `${local.style}; --fsv-mask-image: ${maskImage()}; --fsv-max-height: ${local.maxHeight};`
    }

    return {
      ...(local.style ?? {}),
      ...vars(),
    }
  }

  createEffect(() => {
    const handleResize = () => scheduleSync()
    const handleScroll = () => syncViewport()
    const observer = typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(() => scheduleSync())

    viewport.addEventListener('scroll', handleScroll)
    if (typeof window !== 'undefined')
      window.addEventListener('resize', handleResize)

    observer?.observe(viewport)
    observer?.observe(content)
    scheduleSync()

    onCleanup(() => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener('scroll', handleScroll)
      if (typeof window !== 'undefined')
        window.removeEventListener('resize', handleResize)
      observer?.disconnect()
    })
  })

  return (
    <div
      ref={viewport}
      class={`faded-scroll-viewport ${local.class ?? ''}`}
      style={style()}
      data-lenis-prevent={local.lenisPrevent ? '' : undefined}
      {...others}
    >
      <div ref={content}>{local.children}</div>
    </div>
  )
}
