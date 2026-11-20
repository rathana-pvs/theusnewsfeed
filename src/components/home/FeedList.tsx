'use client'

import { Fragment, useState } from 'react'
import { Article } from '@/types'
import { FeedCard } from './HomeBlocks'
import AdskeeperWidget from '@/components/ads/AdskeeperWidget'
import { i18nStrings } from '@/lib/i18n'

const PER_PAGE = 12
const AD_AFTER = 5 // index of the card the in-feed ad follows

export function FeedList({
  articles,
  feedAdId,
  bottomAdId,
}: {
  articles: Article[]
  feedAdId?: string
  bottomAdId?: string
}) {
  const [visible, setVisible] = useState(PER_PAGE)
  const shown = articles.slice(0, visible)
  const hasMore = visible < articles.length

  return (
    <div>
      <ul>
        {shown.map((a, i) => (
          <Fragment key={a.id}>
            <li className="py-6" style={{ borderTop: '1px solid var(--border)' }}>
              <FeedCard article={a} />
            </li>
            {feedAdId && i === AD_AFTER && (
              <li className="py-6" style={{ borderTop: '1px solid var(--border)' }}>
                <AdskeeperWidget widgetId={feedAdId} placement="home_feed" />
              </li>
            )}
          </Fragment>
        ))}
      </ul>

      {hasMore && (
        <div className="pt-6 pb-2 flex justify-center" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            onClick={() => setVisible((v) => v + PER_PAGE)}
            className="px-6 h-11 rounded-full text-[14px] font-semibold transition-colors hover:bg-[var(--bg-hover)]"
            style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            {i18nStrings.en.loadMore}
          </button>
        </div>
      )}

      {bottomAdId && !hasMore && (
        <div className="pt-8">
          <AdskeeperWidget widgetId={bottomAdId} placement="home_bottom" />
        </div>
      )}
    </div>
  )
}
