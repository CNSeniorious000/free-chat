export function trackEvent(event: string, data?: Record<string, any>) {
  // @ts-expect-error umami is optional
  window.umami && window.umami?.track(event, data)
  // @ts-expect-error gtag is optional
  window.gtag && window.gtag('event', event, data)
}
