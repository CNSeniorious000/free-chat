/**
 * Ripple effect action for Svelte 5
 *
 * This is a custom implementation to fix lifecycle_outside_component error
 * that occurs with the original svelte-ripple-action v2.0.0 library.
 *
 * The Problem:
 * - Original library (https://github.com/posandu/svelte-ripple-action) uses onMount() internally
 * - Svelte 5's lifecycle hooks (onMount/$effect) can only be called during component initialization
 * - When ripple action is used with dynamic event handlers (e.g., onClick={() => {...}}),
 *   the action re-executes outside component init, causing lifecycle_outside_component error
 *
 * The Fix:
 * - Removed onMount/$effect wrapper around initialization logic
 * - Execute setup directly in the action function (imperative, outside component lifecycle)
 * - Move event listener binding to action body, not inside onMount/$effect
 * - Keep cleanup logic in destroy() callback for proper teardown
 *
 * Key Difference:
 *   Original:  action() → onMount() → setup events
 *   Fixed:     action() → setup events directly
 *
 * This follows Svelte 5 best practice: actions run outside component context,
 * so they must not call lifecycle APIs.
 */

import type { Action } from 'svelte/action'

import 'svelte-ripple-action/ripple.css'

interface RippleOptions {
  color?: string
  duration?: number
  maxRadius?: number
  center?: boolean
  disabled?: boolean
}

const INEVENTS = ['pointerdown']
const OUTEVENTS = ['pointerup', 'pointerleave', 'pointercancel']
const ATTR_NAME = 'svelte-ripple-effect-ready'
const ATTR_CENTER_NAME = 'ripple-center'

function findFurthestPoint(
  clickX: number,
  elementWidth: number,
  elementLeft: number,
  clickY: number,
  elementHeight: number,
  elementTop: number,
): number {
  const x = clickX - elementLeft
  const y = clickY - elementTop
  const distanceToRight = elementWidth - x
  const distanceToBottom = elementHeight - y

  return Math.sqrt(
    Math.max(x, distanceToRight) ** 2 + Math.max(y, distanceToBottom) ** 2,
  )
}

function addEvent(element: HTMLElement, event: string, handler: EventListener) {
  element.addEventListener(event, handler, { passive: true })
}

function removeEvent(element: HTMLElement, event: string, handler: EventListener) {
  element.removeEventListener(event, handler)
}

export const ripple: Action<HTMLElement, RippleOptions | undefined> = (el, options: RippleOptions = {}) => {
  let maximumRadius = 0

  const addClassIfMissing = () => {
    if (!el.getAttribute(ATTR_NAME)) {
      el.setAttribute(ATTR_NAME, '')
    }

    if (options?.center) {
      el.setAttribute(ATTR_CENTER_NAME, '')
    } else {
      el.removeAttribute(ATTR_CENTER_NAME)
    }
  }

  const setOptions = (options: RippleOptions | undefined) => {
    if (options?.color) {
      el.style.setProperty('--ripple-color', options.color)
    }

    if (options?.duration) {
      el.style.setProperty('--ripple-duration', `${options.duration}s`)
    }

    if (options?.maxRadius) {
      maximumRadius = options.maxRadius
    }
  }

  const createRipple = (e: Event) => {
    const pointerEvent = e as PointerEvent
    if (options?.disabled) return

    pointerEvent.stopPropagation()

    addClassIfMissing()

    const rect = el.getBoundingClientRect()
    const radius = findFurthestPoint(
      pointerEvent.clientX,
      el.offsetWidth,
      rect.left,
      pointerEvent.clientY,
      el.offsetHeight,
      rect.top,
    )

    const ripple = document.createElement('div')
    ripple.classList.add('ripple')

    let size = radius * 2
    let top = pointerEvent.clientY - rect.top - radius
    let left = pointerEvent.clientX - rect.left - radius

    if (maximumRadius && size > maximumRadius) {
      size = maximumRadius * 2
      top = pointerEvent.clientY - rect.top - maximumRadius
      left = pointerEvent.clientX - rect.left - maximumRadius
    }

    ripple.style.left = `${left}px`
    ripple.style.top = `${top}px`

    ripple.style.width = ripple.style.height = `${size}px`

    el.appendChild(ripple)

    const removeRipple = () => {
      const timeOutDuration = options?.duration
        ? options.duration * 1000
        : 1000

      if (ripple !== null) {
        setTimeout(() => {
          ripple.style.opacity = '0'
        }, timeOutDuration / 4)

        setTimeout(() => {
          ripple.remove()
        }, timeOutDuration)
      }
    }

    OUTEVENTS.forEach((event) => {
      addEvent(el, event, removeRipple)
    })
  }

  // Set up imperatively. Do NOT call Svelte lifecycle/runewrite APIs here —
  // actions run outside of component initialisation and calling $effect or
  // other runes will throw `lifecycle_outside_component`.
  addClassIfMissing()
  setOptions(options)

  INEVENTS.forEach((event) => {
    addEvent(el, event, createRipple)
  })

  const destroy = () => {
    INEVENTS.forEach((event) => {
      removeEvent(el, event, createRipple)
    })
  }

  return {
    update(newOptions: RippleOptions={}) {
      options = newOptions
      setOptions(newOptions)
    },
    destroy() {
      destroy()
    },
  }
}

/**
 * =============================================================================
 * DETAILED CODE CHANGES vs ORIGINAL LIBRARY
 * =============================================================================
 *
 * ORIGINAL (node_modules/.../ripple.js:6-9):
 *   import { onMount } from "svelte";
 *   function ripple(el, options) {
 *     onMount(() => {  // ← This wrapper is REMOVED
 *       addClassIfMissing();
 *       setOptions(options);
 *       INEVENTS.forEach((event) => {
 *         addEvent(el, event, createRipple);
 *       });
 *       return () => {  // Cleanup inside onMount - MOVED
 *         INEVENTS.forEach((event) => {
 *           removeEvent(el, event, createRipple);
 *         });
 *       };
 *     });
 *   }
 *
 * FIXED (this file, line 70-87):
 *   export const ripple: Action<HTMLElement, RippleOptions> = (el, options) => {
 *     // Set up imperatively. Do NOT call Svelte lifecycle/runes APIs here —
 *     addClassIfMissing()  // ← Direct call, NO onMount wrapper
 *     setOptions(options)  // ← Direct call, NO onMount wrapper
 *     INEVENTS.forEach((event) => {  // ← Direct call, NO onMount wrapper
 *       addEvent(el, event, createRipple)
 *     })
 *     const destroy = () => {  // ← Moved from inside onMount to here
 *       INEVENTS.forEach((event) => {
 *         removeEvent(el, event, createRipple)
 *       })
 *     }
 *     return {
 *       update(newOptions) { ... },
 *       destroy() { destroy() }  // ← Cleanup in return object
 *     }
 *   }
 *
 * =============================================================================
 * WHY THE ORIGINAL FAILS
 * =============================================================================
 *
 * With <button use:ripple onClick={() => toggle()}>, the sequence is:
 *
 * 1. Component mounts → use:ripple runs → onMount() executes ✓
 * 2. User clicks → toggle() runs → component re-runs
 * 3. use:ripple re-runs (because handler changed) → onMount() AGAIN ✗
 *
 * WHY step 3 happens:
 * - onClick={() => {...}} creates a NEW function each render
 * - Svelte detects the handler changed
 * - Svelte re-applies the use:ripple directive
 * - onMount is called OUTSIDE component initialization
 * - ERROR: lifecycle_outside_component
 *
 * =============================================================================
 * SVELTE 5 RULE: Actions run OUTSIDE component context
 * =============================================================================
 *
 * These CAN ONLY be called during component init:
 * - onMount(), onDestroy(), afterUpdate()
 * - $effect(), $effect.pre()
 *
 * These are FORBIDDEN in actions (use:xxx):
 * - ALL lifecycle APIs
 * - Because actions can re-run at any time
 *
 * The fix: Use imperative setup, no lifecycle calls
 */
