'use client'

import { useEffect } from 'react'

interface ExitFeedWidgetProps {
  widgetId: string
}

/**
 * Container for Adskeeper's full-screen Exit Feed. The unit stays hidden until
 * Adskeeper detects exit intent (back button / leaving the tab); when and how
 * often it opens is configured in the Adskeeper dashboard, not here.
 * Mounted once in the root layout so it is present on every page.
 */
export function ExitFeedWidget({ widgetId }: ExitFeedWidgetProps) {
  useEffect(() => {
    window._mgq = window._mgq || []
    window._mgq.push(['_mgc.load'])
  }, [widgetId])

  return (
    <div
      data-type="_mgwidget"
      data-widget-id={widgetId}
      data-ad-placement="exit_feed"
      suppressHydrationWarning
    />
  )
}

declare global {
  interface Window {
    _mgq?: any[][]
  }
}
